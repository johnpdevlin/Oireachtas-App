/** @format */

import { BinaryChamber, Chamber, ChamberType, DateRange } from '../_utility';

export type MemberRequest = {
	uri?: string;
	date_start?: string | Date;
	date_end?: string | Date;
	house_no?: number;
	chamber?: BinaryChamber;
	const_code?: string;
	party_code?: string;
	limit?: number;
	formatted?: boolean;
};

export type RawMemberOffice = {
	officeName: {
		showAs: string;
		uri: string;
	};
	dateRange: {
		start: string;
		end: string | null | undefined;
	};
};

export type RawMemberRepresent = {
	representCode: string;
	uri: string;
	showAs: string;
	representType: string;
};

export type RawMemberParty = {
	partyCode: string;
	uri: string;
	showAs: string;
	dateRange: {
		start: string;
		end: string | null | undefined;
	};
};

export type RawOuterMembership = {
	membership: RawMembership;
};

export type RawMemberHouse = {
	houseCode: BinaryChamber;
	uri: string;
	houseNo: string;
	showAs: string;
	chamberType: ChamberType;
};

export type RawMembership = {
	parties: { party: RawMemberParty }[];
	house: RawMemberHouse;
	offices: {
		office: RawMemberOffice;
	}[];
	uri: string;
	represents: { represent: RawMemberRepresent }[];
	dateRange: {
		start: string;
		end: string | null;
	};
};

export type RawMember = {
	showAs: string;
	lastName: string;
	firstName: string;
	gender: string;
	memberships: RawOuterMembership[];
	uri: string;
	wikiTitle: string;
	fullName: string;
	dateOfDeath: null;
	memberCode: string;
	image: boolean;
	pId: string;
};

export type RawOuterMember = {
	member: RawMember;
};

export type MemberApiResponse = {
	head: {
		counts: {
			memberCount: number;
			resultCount: number;
		};
		dateRange: {
			start: string;
			end: string | null | undefined;
		};
		lang: string;
	};
	results: RawOuterMember[];
};

export type RawFormattedMember = {
	uri: string;
	name: string;
	firstName: string;
	lastName: string;
	dateRange: DateRange;
	house: {
		houseCode: BinaryChamber;
		uri: string;
		houseNo: number;
		showAs: string;
		chamberType: ChamberType;
	};
	offices: RawMemberOffice[] | RawMemberOffice;
	constituencies: RawMemberRepresent[] | RawMemberRepresent;
	parties: RawMemberParty[] | RawMemberParty;
};
