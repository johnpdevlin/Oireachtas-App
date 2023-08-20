/** @format */

import { Chamber, ChamberType, Outcome } from '@/models/_utils';

export type VoteRequest = {
	member_id?: string;
	houseNo?: number | string;
	chamber_type?: ChamberType;
	chamber?: Chamber;
	date_start?: string | Date;
	date_end?: string | Date;
	limit?: number;
	outcome?: Outcome;
	debate_id?: string;
	vote_id?: string;
};

export type VoteMember = {
	member: {
		showAs: string;
		uri: string;
		memberCode: string;
	};
};

export type RawVote = {
	chamber: { showAs: string; uri: string };
	category: string;
	house: {
		chamberType: ChamberType;
		committeeCode: string;
		houseCode: Chamber;
		houseNo: string;
		uri: string;
		showAs: string;
	};
	isBill: boolean;
	debate: { showAs: string; uri: string };
	format: {
		pdf: { uri: string } | null;
		xml: { uri: string } | null;
	};
	memberTally?: VoteMember;
	outcome: string;
	subject: { showAs: string; uri: string | null };
	tellers: string;
	tallies: {
		nilVotes: {
			tally: number;
			showAs: string;
			members: VoteMember[];
		};
		staonVotes: {
			tally: number;
			showAs: string;
			members: VoteMember[];
		};
		taVotes: {
			tally: number;
			showAs: string;
			members: VoteMember[];
		};
	};
	date: string;
	datetime: string;
	voteId: string;
	uri: string;
	voteNote: string;
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
	results: { division: { contextDate: string; division: RawVote }[] };
};
