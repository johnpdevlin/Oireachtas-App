/** @format */

import { BinaryChamber, CommitteeType, MemberBaseKeys } from './_utils';

import { DateRangeObj } from './dates';

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
