/** @format */

import {
	BinaryChamber,
	CommitteeType,
	GroupType,
	MemberBaseKeys,
} from './_utils';
import { DateRange, DateRangeObj, DateRangeStr } from './dates';
import { CommitteeDebateRecord } from './oireachtasApi/debate';

export type CommitteeMember = {
	dateRange: DateRangeObj;
} & MemberBaseKeys;

export type CommitteeMembers = {
	dail: CommitteeMember[];
	seanad: CommitteeMember[];
};

export type Committee = {
	name: string;
	uri: string;
	url: string;
	chamber: BinaryChamber;
	types: CommitteeType[];
	dail_no: number;
	chair: MemberBaseKeys;
	members: CommitteeMembers;
	pastMembers: CommitteeMembers;
	dateRange: DateRangeObj;
} & Partial<ExpiredDetails>;

export type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
};

export type CommitteeAttendance = CommitteeDebateRecord & {
	type: string;
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};

export type CommitteeAttendanceRecord = {
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

export type GroupCommitteeAttendanceRecord = CommitteeAttendanceRecord;

export type IndCommiteeAttendanceRecord = {
	committee_type: CommitteeType;
	committee_uri: string;
	committee_name: string;
	committee_root_uri: string;
	committee_root_name: string;
};

export type MemberIndCommAttendanceRecord = IndCommiteeAttendanceRecord &
	CommitteeAttendanceRecord;
