/** @format */

import { CommitteeDebateRecord } from './OireachtasAPI/debate';
import { BinaryChamber, CommitteeType, MemberBaseKeys } from './_utility';
import { DateRangeObj, DateRangeStr } from './dates';

export type PastCommitteeMember = {
	dateRange: DateRangeObj;
	dateRangeStr: DateRangeStr;
} & MemberBaseKeys;

export type PastCommitteeMembers = {
	dail?: PastCommitteeMember[];
	seanad?: PastCommitteeMember[];
};

export type CommitteeMembers = {
	dail?: MemberBaseKeys[];
	seanad?: MemberBaseKeys[];
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
	pastMembers?: PastCommitteeMembers;
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
