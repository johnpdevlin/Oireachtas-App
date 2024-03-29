/** @format */

import { CommitteeType, GroupType, MemberBaseKeys, URIpair } from './_utils';
import { DateRangeObj } from './dates';
import { CommitteeDebateRecord } from './oireachtasApi/debate';

export type SittingDays = {
	name?: string;
	uri?: string;
	dateRange: DateRangeObj;
	limit: number;
	totalPossibleSittings: number;
	sittingDates: (string | undefined)[];
	otherDates: (string | undefined)[];
	sittingTotal: number;
	otherTotal: number;
	total: number;
	year: number;
};

export type SittingDaysRecord = {
	url: string;
	uri: string;
} & SittingDays;

export type AttendanceRecord = {
	record_uri: string;
	uri: string;
	group_type: GroupType;
	dateRange?: DateRangeObj;
	year?: number;
	present: Date[][];
	absent: Date[][];
	also_present: Date[][];
	presentPercentage?: {
		overall: number;
		months: (number | undefined)[];
	};
};

export type GroupAttendanceRecord = AttendanceRecord & {
	present: { uri: string; date: Date }[][];
	absent: { uri: string; date: Date }[][];
	also_present: { uri: string; date: Date }[][];
};

export type CommitteeAttendance = CommitteeDebateRecord & {
	type: string;
	present: URIpair[];
	absent: URIpair[];
	alsoPresent: URIpair[];
};

export type IndCommiteeAttendanceRecord = {
	committee_type: CommitteeType;
	committee_uri: string;
	committee_name: string;
	committee_root_uri: string;
	committee_root_name: string;
};

export type MemberIndCommAttendanceRecord = IndCommiteeAttendanceRecord &
	AttendanceRecord;
