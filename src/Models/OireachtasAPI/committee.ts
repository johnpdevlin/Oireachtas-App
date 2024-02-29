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

export type CommitteeName = {
	dateRange: DateRangeStr;
	nameGa?: string;
	nameEn: string;
};

export type RawCommittee = {
	uri: string; // unique
	committeeDateRange: DateRangeStr;
	committeeType: RawCommitteeType[];
	expiryType: 'Sessional' | 'Standing' | 'Special';
	mainStatus: 'Live' | 'Dissolved' | 'Archived';
	serviceUnit:
		| "Committees' Secretariat"
		| 'Journal Office'
		| 'Bills Office'
		| 'Seanad Office';
	committeeCode: string; // Committees which occur across multiple sessions may share
	committeeID: number; // Unique
	committeeName: CommitteeName[];
	altCommitteeURIs: string[];
	houseNo: number;
	status: 'Live - Primary' | 'Dissolved' | 'Archived';
	members: RawCommitteeMember[];
};
