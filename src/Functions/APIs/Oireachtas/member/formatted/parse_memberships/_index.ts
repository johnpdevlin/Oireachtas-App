/** @format */

import {
	RawMemberCommittee,
	RawMemberHouse,
	RawMemberParty,
	RawMemberRepresent,
	RawOuterMembership,
} from '@/models/oireachtasApi/member';
import parseAndFormatOffices from './offices';
import { RawMemberOffice } from '@/models/oireachtasApi/member';
import parseAndFormatConstituencies from './constituencies';
import parseAndFormatParties from './parties';
import { BinaryChamber } from '@/models/_utils';
import { DateRangeObj, DateRangeStr, OirDate } from '@/models/dates';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';
import { MemberParty } from '@/models/oireachtasApi/Formatted/Member/party';
import { parseAndFormatCommittees } from './committees';
import { MemberCommittee } from '@/models/oireachtasApi/Formatted/Member/committee';

type MembershipResponse = {
	constituencies: {
		dail: MemberConstituency[];
		seanad: MemberConstituency[];
	};
	isActiveSenator: boolean;
	isActiveTD: boolean;
	parties: MemberParty[];
	offices: MemberOffice[];
	committees: { current: MemberCommittee[]; past: MemberCommittee[] };
	isActiveSeniorMinister: boolean;
	isActiveJunior: boolean;
};

/*
	Breaks up into individual objects
	Parses objects to merge periods and infers certain data
	Returns above object
*/
function parseMemberships(
	memberships: RawOuterMembership[]
): MembershipResponse {
	const destructured = destructureMemberships(memberships);

	const constits = parseAndFormatConstituencies(destructured.constits);

	const { isActiveSenator, isActiveTD } = constits;
	const constituencies = {
		dail: constits.dail,
		seanad: constits.seanad,
	};

	const parties = parseAndFormatParties(destructured.parties);
	const offices = parseAndFormatOffices(destructured.offices as RawMoffice[]);
	const rawCommittees = memberships
		.flat()
		.map((mem) => mem.membership.committees)
		.flat();
	const committees = parseAndFormatCommittees(rawCommittees);

	return {
		constituencies,
		isActiveSenator,
		isActiveTD,
		parties,
		offices: offices.offices,
		...(offices.offices.length > 0
			? {
					isActiveSeniorMinister: offices.isActiveSeniorMinister,
					isActiveJunior: offices.isActiveJunior,
			  }
			: { isActiveJunior: false, isActiveSeniorMinister: false }),
		committees,
	} as MembershipResponse;
}

type House = RawMemberHouse & { dateRange: DateRangeStr };

export type RawMoffice = RawMemberOffice & { house: House };
export type RawMemberConstituency = RawMemberRepresent & { house: House };
export type RawMparty = RawMemberParty & {
	house: House;
	chamber: BinaryChamber;
	dateRange?: DateRangeObj;
	dateRangeStr: DateRangeStr;
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

	memberships.forEach((membership) => {
		const mem = membership.membership;

		// House allows for easy comparison
		const house: House = {
			...mem.house,
			dateRange: mem.dateRange as DateRangeStr,
		};

		if (mem.offices?.length > 0)
			mem.offices.forEach((office) =>
				offices.push({ house: house, ...office.office })
			);
		if (mem.represents?.length > 0)
			mem.represents.forEach((represent) => {
				if (represent.represent.representType === 'panel')
					constits.seanad.push({ house, ...represent.represent });
				else constits.dail.push({ house, ...represent.represent });
			});
		if (mem.parties?.length > 0)
			mem.parties.forEach((p) =>
				parties.push({
					...p.party,
					house,
					chamber: house.houseCode,
				} as RawMparty)
			);
	});

	return { offices, parties, constits };
}

export default parseMemberships;
