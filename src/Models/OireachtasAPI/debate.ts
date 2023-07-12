/** @format */

import { Chamber, ChamberType, CommitteeType } from '@/Models/_utility';

export type DebateRequest = {
	member?: string;
	chamber_type?: ChamberType;
	chamber_id?: Chamber;
	date_start?: string | Date;
	date_end?: string | Date;
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
		houseCode: Chamber;
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
	name: string;
	type: CommitteeType;
	chamber: Chamber;
	houseNo: number;
	uri: string;
	subURI: string; // to differentiate for joint, select etc.
	pdf?: string;
	xml?: string;
};
