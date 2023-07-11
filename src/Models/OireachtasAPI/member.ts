/** @format */

import { Chamber, DateRange } from '../_utility';

export type MemberRequest = {
	uri?: string;
	date_start?: string | Date;
	date_end?: string | Date;
	house_no?: number;
	chamber?: Chamber;
	const_code?: string;
	party_code?: string;
	limit?: number;
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

export type RawMembership = {
	parties: RawMemberParty[];
	house: {
		houseCode: string;
		uri: string;
		houseNo: string;
		showAs: string;
		chamberType: string;
	};
	offices: {
		office: RawMemberOffice;
	}[];
	uri: string;
	represents: RawMemberRepresent[];
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
	memberships: RawMembership;
	uri: string;
	wikiTitle: string;
	fullName: string;
	dateOfDeath: null;
	memberCode: string;
	image: boolean;
	pId: string;
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
	results: { member: RawMember[] };
};

export type RawFormattedMember = {
	uri: string;
	name: string;
	firstName: string;
	lastName: string;
	dateRange: DateRange;
	house: {
		houseCode: string;
		uri: string;
		houseNo: string;
		showAs: string;
		chamberType: string;
	};
	offices: RawMemberOffice[] | RawMemberOffice;
	constituencies: RawMemberRepresent[] | RawMemberRepresent;
	parties: RawMemberParty[] | RawMemberParty;
};
