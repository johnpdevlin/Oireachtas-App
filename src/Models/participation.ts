/** @format */

import { Chamber } from './_util';

export type MembershipType =
	| 'house'
	| 'party'
	| 'constituency'
	| 'panel'
	| 'committee';

export type groupType =
	| 'td'
	| 'house'
	| 'party'
	| 'constituency'
	| 'panel'
	| 'committee';

export type DaySpeeches = {
	houseSpeeches?: number;
	committeeSpeeches?: number;
};

export type DayQuestions = {
	oralQuestions?: number;
	writtenQuestions?: number;
};

export type DayVotes = {
	houseVotes?: number;
	committeeVotes?: number;
	houseVotesMissed?: number;
};

export type DayCommitteeVotes = {
	committeeUri: string;
	date: Date;
	committeeVotes: number;
	committeeVotesMissed: number;
};

export interface ParticipationRecord {
	type?: groupType;
	uri: string;
	house: Chamber;
	houseNo?: number;
	members: Array<string>;
	houseContributed: number;
	noHouseContribution: number;
	committeePresent?: number;
	committeeAbsent?: number;
	houseSpeeches: number;
	committeeSpeeches?: number;
	oralQuestions?: number;
	writtenQuestions?: number;
	houseVotes: number;
	committeeVotes?: number;
}

export type DayParticipationRecord = {
	name: string;
	uri: string;
	date: Date;
	chamber: Chamber;
	houseNo: number;
	housePresent?: boolean;
	committeePresent?: boolean;
} & DaySpeeches &
	DayQuestions &
	DayVotes;

export type GroupParticipationRecord = {
	type?: groupType;
	pastMembers?: Array<{ uri: string; days: number }>;
	count?: number | undefined;
} & ParticipationRecord;
