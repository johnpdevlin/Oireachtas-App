/** @format */

import {
	BinaryChamber,
	Chamber,
	ChamberType,
	CommitteeType,
} from '@/models/_utils';
import { OirDate } from '@/models/dates';

export type DebateRequest = {
	member?: string;
	chamber_type?: ChamberType;
	chamber_id?: Chamber;
	date_start?: string;
	date_end?: string;
	debate_id?: string;
	limit?: number;
};

export type DebateRecord = {
	[x: string]: any;
	lastUpdated: string;
	chamber: {
		showAs: string;
		uri: string;
	};
	house: {
		uri: string;
		houseNo: string;
		showAs: string;
		committeeCode?: string;
		houseCode: BinaryChamber;
		chamberType: string;
	};
	counts: {
		debateSectionCount: number;
		contributorCount: number;
		divisionCount: number;
		questionCount: number;
		billCount: number;
	};
	uri: string;
	formats: Record<string, any>;
	debateSections: {
		text: Array<{
			textType: string;
			text: string;
		}>;
		showAs: string;
		debateType: string;
		counts: {
			speechCount: number;
			speakerCount: number;
		};
		speakers: {
			memberCode: string;
			role: string | null;
			showAs: string;
			uri: string;
		};
		containsDebate: boolean;
		uri: string;
		debateSectionId: string;
		formats: Record<string, any>;
	};
	date: string;
};

export type CommitteeDebateRecord = {
	date: Date;
	dateStr: string;
	rootName: string;
	rootURI: string;
	name: string;
	type: CommitteeType;
	chamber: BinaryChamber;
	houseNo: number;
	uri: string; // to differentiate for joint, select etc.
	pdf: string;
	xml: string;
};

export type MemberDebateParticipationRecord = {
	uri: string;
	date: Date;
	contributions: number;
};
