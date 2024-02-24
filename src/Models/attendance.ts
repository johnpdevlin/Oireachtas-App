/** @format */

import { CommitteeType, GroupType, MemberBaseKeys } from './_utils';
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
};

export type SittingDaysRecord = {
	url: string;
	year: number;
} & SittingDays;

export type AttendanceRecord = {
	record_uri: string;
	uri: string;
	group_type: GroupType;
	date_start?: Date;
	date_end?: Date;
	year?: number;
	present: Date[][];
	absent: Date[][];
	also_present: Date[][];
};

export type GroupAttendanceRecord = AttendanceRecord & {
	present: { uri: string; house_code: string; date: Date }[][];
	absent: { uri: string; house_code: string; date: Date }[][];
	also_present: { uri: string; house_code: string; date: Date }[][];
};

export type CommitteeAttendance = CommitteeDebateRecord & {
	type: string;
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
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
