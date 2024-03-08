/** @format */

import { DateRangeStr } from '@/models/dates';
import { CommitteeMainStatus, CommitteeName } from '../../committee';
import { RawMemberCommittee } from '../../member';

export type MemberCommittee = Omit<
	RawMemberCommittee,
	| 'committeeDateRange'
	| 'committeeName'
	| 'mainStatus'
	| 'status'
	| 'memberDateRange'
	| 'fullName'
	| 'lastName'
	| 'firstName'
> & {
	dateRange: DateRangeStr;
	status: CommitteeMainStatus;
	name: string;
	nameGa?: string;
	formerNames: CommitteeName[];
};
