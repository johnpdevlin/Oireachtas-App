/** @format */

import { DateRangeStr } from '@/models/dates';
import {
	CommitteeMainStatus,
	CommitteeName,
	RawMemberCommittee,
} from '../../committee';

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
