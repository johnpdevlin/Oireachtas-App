/** @format */

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
