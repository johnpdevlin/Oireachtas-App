/** @format */

export interface Member {
	member: {
		showAs: string;
		uri: string;
		memberCode: string;
	};
}

export interface Tallies {
	nilVotes: {
		tally: number;
		showAs: string;
		members: Member[];
	};
	taVotes: {
		tally: number;
		showAs: string;
		members: Member[];
	};
	staonVotes: {
		tally: number;
		showAs: string;
		members: Member[];
	};
}

export interface Chamber {
	showAs: string;
	uri: string;
}

export interface Subject {
	showAs: string;
}

export interface Debate {
	showAs: string;
	uri: string;
	formats: {};
	debateSection: string;
}

export interface Division {
	isBill: boolean;
	debate: Debate;
	voteId: string;
	tallies: Tallies;
	chamber: Chamber;
	category: string;
	subject: Subject;
	uri: string;
	outcome: string;
	tellers: string;
	house: {
		uri: string;
		houseNo: string;
		houseCode: string;
		chamberType: string;
		showAs: string;
		committeeCode: string;
	};
	date: string;
}

interface Result {
	division: Division;
}

interface Head {
	counts: {};
	dateRange: {
		start: string;
		end: string;
	};
	lang: string;
}

export interface DivisionApiResponse {
	head: Head;
	results: Result[];
}
