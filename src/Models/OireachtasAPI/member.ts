/** @format */

import { BinaryChamber, ChamberType, MemberURI } from '../_utils';
import { DateRangeStr } from '../dates';

export type MemberRequest = {
	uri?: MemberURI;
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
	dateRange: DateRangeStr;
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
	dateRange: DateRangeStr;
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
	dateRange: DateRangeStr;
};

export type RawMember = {
	showAs: string;
	lastName: string;
	firstName: string;
	gender: string;
	memberships: RawOuterMembership[];
	uri: string;
	fullName: string;
	dateOfDeath: null;
	memberCode: MemberURI;
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
		dateRange: DateRangeStr;
		lang: string;
	};
	results: RawOuterMember[];
};

export type RawFormattedMember = {
	uri: string;
	name: string;
	firstName: string;
	lastName: string;
	dateRange: DateRangeStr;
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
