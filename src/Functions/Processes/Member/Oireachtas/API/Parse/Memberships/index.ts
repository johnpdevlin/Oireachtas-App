/** @format */

import {
	RawMemberHouse,
	RawMemberParty,
	RawMemberRepresent,
	RawOuterMembership,
} from '@/Models/OireachtasAPI/member';
import parseAndFormatOffices from './offices';
import { RawMemberOffice } from '../../../../../../../Models/OireachtasAPI/member';
import parseAndFormatConstituencies from './constituencies';
import parseAndFormatParties from './parties';
import { BinaryChamber } from '@/Models/_utility';
import { getEndDateObj } from '@/Functions/Util/dates';
import { DateRangeStr, OirDate } from '@/Models/dates';
import { MemberConstituency } from '@/Models/DB/constituency';
import { MemberOffice } from '@/Models/DB/office';
import { MemberParty } from '@/Models/DB/party';

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
	const offices = parseAndFormatOffices(
		destructured.offices as RawMemberOffice[]
	);

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

export type RawMemberOffice = RawMemberOffice & { house: House };
export type RawMemberConstituency = RawMemberRepresent & { house: House };
export type RawMemberParty = RawMemberParty & {
	house: House;
	chamber: BinaryChamber;
	start: Date;
	end: Date | undefined;
};

type RawMembershipsObj = {
	offices?: RawMemberOffice[];
	constits: { dail: RawMemberConstituency[]; seanad: RawMemberConstituency[] };
	parties: RawMemberParty[];
};
// Destructures and formats so can be easily processed / compared
function destructureMemberships(
	memberships: RawOuterMembership[]
): RawMembershipsObj {
	const offices: RawMemberOffice[] = [];
	const constits: {
		dail: RawMemberConstituency[];
		seanad: RawMemberConstituency[];
	} = {
		dail: [],
		seanad: [],
	};
	const parties: RawMemberParty[] = [];

	memberships.map((membership) => {
		const mem = membership.membership;

		// House allows for easy comparison
		const house: House = {
			...mem.house,
			dateRange: mem.dateRange as DateRangeStr,
		};

		if (mem.offices?.length > 0)
			mem.offices.map((office) => offices.push({ house, ...office.office }));
		if (mem.represents?.length > 0)
			mem.represents.map((represent) => {
				if (represent.represent.representType === 'panel')
					constits.seanad.push({ house, ...represent.represent });
				else constits.dail.push({ house, ...represent.represent });
			});

		if (mem.parties?.length > 0)
			mem.parties.map((party) =>
				parties.push({
					house,
					chamber: house.houseCode,
					start: new Date(party.party.dateRange.start),
					end: getEndDateObj(
						party.party.dateRange.end as OirDate | undefined | null
					),
					...party.party,
				})
			);
	});

	return { offices, parties, constits };
}
