/** @format */

import { Chamber } from '@/Models/_utility';
import fetcher from '..';

export type MemberRequest = {
	uri?: string;
	date_start?: string;
	date_end?: string;
	house_no?: number;
	chamber?: Chamber;
	const_code?: string;
	party_code?: string;
	limit?: number;
};

export interface MemberHead {
	counts: {
		memberCount: number;
		resultCount: number;
	};
	dateRange: {
		start: string;
		end: string | null;
	};
	lang: string;
}

export interface Party {
	partyCode: string;
	uri: string;
	showAs: string;
	dateRange: {
		end: string | null;
		start: string;
	};
}

export interface Office {
	officeName: {
		showAs: string;
		uri: string;
	};
	dateRange: {
		end: string | null;
		start: string;
	};
}

export interface Represent {
	representCode: string;
	uri: string;
	showAs: string;
	representType: string;
}

export interface Membership {
	parties: { party: Party }[];
	house: {
		houseCode: string;
		uri: string;
		houseNo: string;
		showAs: string;
		chamberType: string;
	};
	offices: { office: Office }[];
	uri: string;
	represents: { represent: Represent }[];
	dateRange: {
		end: string;
		start: string;
	};
}

export interface Member {
	showAs: string;
	lastName: string;
	firstName: string;
	gender: string;
	memberships: { membership: Membership }[];
	uri: string;
	wikiTitle: string;
	fullName: string;
	dateOfDeath: null;
	memberCode: string;
	image: boolean;
	pId: string;
}

export interface MemberResult {
	member: Member;
}

export interface MemberApiResponse {
	head: MemberHead;
	results: MemberResult[];
}

export default async function fetchMembers(
	props: MemberRequest
): Promise<Member[]> {
	let url: string;

	if (props.uri!) {
		url = `https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.uri}`;
	} else {
		url = `https://api.oireachtas.ie/v1/members?${
			props.date_start ? `date_start=${props.date_start}` : ''
		}&chamber_id=${props.chamber ? `&chamber=${props.chamber}` : ''}${
			props.house_no ? `&house_no=${props.house_no}` : ''
		}&date_end=${props.date_end ? props.date_end : '2099-01-01'}${
			props.const_code ? `&const_code=${props.const_code}` : ''
		}${props.party_code ? `&party_code=${props.party_code}` : ''}&limit=${
			props.limit ? props.limit : 2500
		}`;
	}

	let members: Member[] = (await fetcher(url)).results.map(
		(member: { member: MemberResult }) => member.member
	);

	return members;
}
