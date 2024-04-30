/** @format */

import { DateRangeStr } from '../dates';

export type RawCommitteeType =
	| 'Shadow Department'
	| 'The Committee System and Parliamentary Administration'
	| 'Policy'
	| 'Parliamentary Regulation and Reform'
	| 'Parliamentary Business and Committee Membership'
	| 'Oversight'
	| 'Consultative'
	| 'Sub Committee'
	| 'Committees relating to Private Business';

export type CommitteeName = {
	dateRange: DateRangeStr;
	nameGa?: string;
	nameEn: string;
};

export type ServiceUnitType =
	| "Committees' Secretariat"
	| 'Journal Office'
	| 'Bills Office'
	| 'Seanad Office';

export type CommitteeMainStatus = 'Live' | 'Dissolved' | 'Archived';
export type CommitteeStatus = Exclude<CommitteeMainStatus, 'Live'> &
	'Live - Primary';
export type ExpiryType = 'Sessional' | 'Standing' | 'Special';

export type RawCommitteeMember = {
	uri: string;
	fullName: string;
	firstName: string;
	lastName: string;
	role:
		| { dateRange: DateRangeStr; title: string }[]
		| {}
		| { dateRange: DateRangeStr; title: string };
	memberDateRange: DateRangeStr;
};

export type RawMemberCommittee = {
	committeeType: RawCommitteeType[];
	role: {
		dateRange: DateRangeStr;
		title: string;
	};
	mainStatus: CommitteeMainStatus;
	committeeID: number;
	committeeCode: string;
	uri: string;
	committeeDateRange: DateRangeStr;
	expiryType: string;
	serviceUnit: string;
	memberDateRange: DateRangeStr;
	houseCode: string;
	committeeName: CommitteeName[];
	houseNo: number;
	status: CommitteeStatus;
};

export type RawCommittee = {
	uri: string; // unique
	committeeDateRange: DateRangeStr;
	committeeType: RawCommitteeType[];
	expiryType: ExpiryType;
	mainStatus: CommitteeMainStatus;
	serviceUnit: ServiceUnitType;
	committeeCode: string; // Committees which occur across multiple sessions may share
	committeeID: number; // Unique
	committeeName: CommitteeName[];
	altCommitteeURIs: string[];
	houseNo: number;
	status: CommitteeStatus;
	members: RawCommitteeMember[];
};
