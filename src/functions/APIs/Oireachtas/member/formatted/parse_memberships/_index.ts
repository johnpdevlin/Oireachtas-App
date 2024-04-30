/** @format */

import {
	RawMemberHouse,
	RawMemberParty,
	RawMemberRepresent,
	RawOuterMembership,
} from '@/models/oireachtas_api/member';
import parseAndFormatOffices from './offices';
import { RawMemberOffice } from '@/models/oireachtas_api/member';
import parseAndFormatConstituencies from './constituencies';
import parseAndFormatParties from './parties';
import { BinaryChamber } from '@/models/_utils';
import { DateRangeObj, DateRangeStr } from '@/models/dates';
import { MemberConstituency } from '@/models/oireachtas_api/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtas_api/Formatted/Member/office';
import { MemberParty } from '@/models/oireachtas_api/Formatted/Member/party';
import { parseAndFormatCommittees } from './committees';
import { MemberCommittee } from '@/models/oireachtas_api/Formatted/Member/committee';
import { RawMemberCommittee } from '../../../../../../models/oireachtas_api/committee';

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
	isActiveJuniorMinister: boolean;
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
		dail: constits.dail ?? [],
		seanad: constits.seanad ?? [],
	};

	const parties = parseAndFormatParties(destructured.parties);
	const offices = parseAndFormatOffices(destructured.offices as RawMoffice[]);
	const committees = parseAndFormatCommittees(destructured.committees);

	return {
		constituencies,
		isActiveSenator,
		isActiveTD,
		parties,
		offices: offices.offices ?? [],
		isActiveSeniorMinister: offices.isActiveSeniorMinister,
		isActiveJuniorMinister: offices.isActiveJuniorMinister,
		committees,
	};
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
	committees: RawMemberCommittee[];
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
	const committees: RawMemberCommittee[] = [];

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
		if (mem.committees?.length > 0) committees.push(...mem.committees);
	});

	return { offices, parties, constits, committees };
}

export default parseMemberships;
