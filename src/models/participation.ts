/** @format */

import { ChamberType, CommitteeType } from './_utils';

/** 
	INDIVIDUAL TD / SENATORS
**/

type ParticipationRecord = {
	uri: string;
	type: ChamberType;
	recordedPresent: boolean;
	contributed: boolean;
	speeches: number;
	votes: number;
	votesMissed?: number;
};

type DayParticipationRecord = {
	date: Date;
	dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
} & ParticipationRecord;

export type DayParticipationHouseRecord = {
	type: 'house';
	oralQuestions: number;
	writtenQuestions: number;
} & DayParticipationRecord;

export type DayParticipationCommitteeRecord = {
	type: 'committee';
	committeeUri: string;
	committeeType: CommitteeType;
} & DayParticipationRecord;

/**
 * Group Participation Records
 */

type groupType =
	| 'td'
	| 'house'
	| 'party'
	| 'constituency'
	| 'panel'
	| 'committee';

export type GroupParticipationRecord = {
	type?: groupType;
	uri: string;
	present: number;
	notPresent: number;
	contributed: number;
	notContributed: number;
	contributions: number;
	votes: number;
	questions?: number;
};

export type GroupParticipationDayRecord = {
	date: Date;
	dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
} & GroupParticipationRecord;
