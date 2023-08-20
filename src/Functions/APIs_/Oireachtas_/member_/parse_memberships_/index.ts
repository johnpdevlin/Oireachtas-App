/** @format */

import {
	RawMemberHouse,
	RawMemberParty,
	RawMemberRepresent,
	RawOuterMembership,
} from '@/models/oireachtasApi/member';
import parseAndFormatOffices from './offices_';
import { RawMemberOffice } from '@/models/oireachtasApi/member';
import parseAndFormatConstituencies from './constituencies_';
import parseAndFormatParties from './parties_';
import { BinaryChamber } from '@/models/_utils';
import { getEndDateObj } from '@/functions/_utils/dates';
import { DateRangeObj, DateRangeStr, OirDate } from '@/models/dates';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';
import { MemberParty } from '@/Models/DB/Member/party';

type MembershipResponse = {
	constituencies: {
		dail?: MemberConstituency[];
		seanad?: MemberConstituency[];
	};
	isActiveSenator: boolean;
	isActiveTD: boolean;
	parties: MemberParty[];
	offices?: MemberOffice[];
	isActiveSeniorMinister: boolean;
	isActiveJunior: boolean;
};

/*
	Breaks up into individual objects
	Parses objects to merge periods and infers certain data
	Returns above object
*/
export default function parseMemberships(
	memberships: RawOuterMembership[]
): MembershipResponse {
	const destructured = destructureMemberships(memberships);

	const constits = parseAndFormatConstituencies(destructured.constits);
	// console.log(constits);
	const { isActiveSenator, isActiveTD } = constits;
	const constituencies = {
		dail: constits.dail,
		seanad: constits.seanad,
	};

	const parties = parseAndFormatParties(destructured.parties);
	const offices = parseAndFormatOffices(destructured.offices as RawMoffice[]);

	return {
		constituencies,
		isActiveSenator,
		isActiveTD,
		parties,
		...(offices.offices.length > 0
			? {
					offices: offices.offices,
					isActiveSeniorMinister: offices.isActiveSeniorMinister,
					isActiveJunior: offices.isActiveJunior,
			  }
			: { isActiveJunior: false, isActiveSeniorMinister: false }),
	} as MembershipResponse;
}

type House = RawMemberHouse & { dateRange: DateRangeStr };

export type RawMoffice = RawMemberOffice & { house: House };
export type RawMemberConstituency = RawMemberRepresent & { house: House };
export type RawMparty = RawMemberParty & {
	house: House;
	chamber: BinaryChamber;
	dateRange: DateRangeObj;
};

type RawMembershipsObj = {
	offices?: RawMoffice[];
	constits: { dail: RawMemberConstituency[]; seanad: RawMemberConstituency[] };
	parties: RawMparty[];
};
// Destructures and formats so can be easily processed / compared
function destructureMemberships(
	memberships: RawOuterMembership[]
): RawMembershipsObj {
	const offices: RawMoffice[] = [];
	const constits: {
		dail: RawMemberConstituency[];
		seanad: RawMemberConstituency[];
	} = {
		dail: [],
		seanad: [],
	};
	const parties: RawMparty[] = [];

	memberships.map((membership) => {
		const mem = membership.membership;

		// House allows for easy comparison
		const house: House = {
			...mem.house,
			dateRange: mem.dateRange as DateRangeStr,
		};

		if (mem.offices?.length > 0)
			mem.offices.map((office) =>
				offices.push({ house: house, ...office.office })
			);
		if (mem.represents?.length > 0)
			mem.represents.map((represent) => {
				if (represent.represent.representType === 'panel')
					constits.seanad.push({ house, ...represent.represent });
				else constits.dail.push({ house, ...represent.represent });
			});

		if (mem.parties?.length > 0)
			mem.parties.map((party) =>
				parties.push({
					...party.party,
					house,
					chamber: house.houseCode,
					dateRange: {
						start: new Date(party.party.dateRange.start),
						end: getEndDateObj(
							party.party.dateRange.end as OirDate | undefined
						),
					} as DateRangeObj,
				} as RawMparty)
			);
	});

	return { offices, parties, constits };
}
