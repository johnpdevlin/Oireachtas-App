/** @format */

import { Chamber } from '../_utility';

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

export type RawMembership = {
	parties: {
		partyCode: string;
		uri: string;
		showAs: string;
		dateRange: {
			start: string;
			end: string | null | undefined;
		};
	}[];
	house: {
		houseCode: string;
		uri: string;
		houseNo: string;
		showAs: string;
		chamberType: string;
	};
	offices: {
		office: {
			officeName: {
				showAs: string;
				uri: string;
			};
			dateRange: {
				start: string;
				end: string | null | undefined;
			};
		};
	}[];
	uri: string;
	represents: {
		represent: {
			representCode: string;
			uri: string;
			showAs: string;
			representType: string;
		};
	}[];
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
	dateRange: { start: string; end: string | null | undefined };
	house: {};
	offices: {};
	constituencies: {};
	parties: {};
};
