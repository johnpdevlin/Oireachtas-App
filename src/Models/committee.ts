/** @format */

import { CommitteeDebateRecord } from './OireachtasAPI/debate';
import { Chamber, CommitteeType, MemberBaseKeys, URIpair } from './_utility';

export type PastCommitteeMember = {
	dateRange: {
		date_start: Date;
		date_end: Date;
	};
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
	chamber: Exclude<Chamber, 'dail & seanad'>;
	types: CommitteeType[];
	dail_no: number;
	chair: MemberBaseKeys;
	members: CommitteeMembers;
	pastMembers?: PastCommitteeMembers;
} & Partial<ExpiredDetails>;

export type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
	endDate: Date;
};

export type CommitteeAttendance = CommitteeDebateRecord & {
	present: MemberBaseKeys[];
	absent: MemberBaseKeys[];
	alsoPresent: MemberBaseKeys[];
};
