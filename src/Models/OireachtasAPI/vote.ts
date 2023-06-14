/** @format */

import { Chamber, ChamberType, Outcome } from '@/Models/_utility';

export type VoteRequest = {
	member_id?: string;
	chamber_type?: ChamberType;
	chamber?: Chamber;
	date_start?: string;
	date_end?: string;
	limit?: number;
	outcome?: Outcome;
	debate_id?: string;
	vote_id?: string;
};

export type Member = {
	member: {
		showAs: string;
		uri: string;
		memberCode: string;
	};
};

export type Vote = {
	isBill: boolean;
	debate: { showAs: string; uri: string };
	formats: {};
	debateSection: string;
	voteId: string;
	tallies: {
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
	};
	chamber: { showAs: string; uri: string };
	category: string;
	subject: { showAs: string };
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
};

export type VoteApiResponse = {
	head: {
		counts: {};
		dateRange: {
			start: string;
			end: string;
		};
		lang: string;
	};
	results: { division: Vote }[];
};
