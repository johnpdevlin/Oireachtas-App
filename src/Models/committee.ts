/** @format */

import { CommitteeDebateRecord } from './OireachtasAPI/debate';
import { BinaryChamber, CommitteeType, MemberBaseKeys } from './_utility';
import { DateRangeObj, DateRangeStr } from './dates';

export type CommitteeMember = {
	dateRange: DateRangeObj;
	dateRangeStr: DateRangeStr;
} & MemberBaseKeys;

export type CommitteeMembers = {
	dail?: CommitteeMember[];
	seanad?: CommitteeMember[];
};

export type Committee = {
	name: string;
	uri: string;
	url: string;
	chamber: BinaryChamber;
	types: CommitteeType[];
	dail_no: number;
	chair: MemberBaseKeys;
	members?: CommitteeMembers;
	pastMembers?: CommitteeMembers;
	dateRange: DateRangeObj;
	dateRangeStr: DateRangeStr;
} & Partial<ExpiredDetails>;

export type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
};

export type CommitteeAttendance = CommitteeDebateRecord & {
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};
