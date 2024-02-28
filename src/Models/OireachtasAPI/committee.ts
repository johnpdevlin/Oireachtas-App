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

export type RawCommittee = {
	uri: string;
	committeeDateRange: DateRangeStr;
	committeeType: RawCommitteeType[];
	expiryType: 'Sessional' | 'Standing' | 'Special';
	mainStatus: 'Live' | 'Dissolved' | 'Archived';
	serviceUnit:
		| "Committees' Secretariat"
		| 'Journal Office'
		| 'Bills Office'
		| 'Seanad Office';
	committeeCode: string;
	committeeID: number;
	committeeName: {
		dateRange: DateRangeStr;
		nameGa: string;
		nameEn: string;
	}[];
	houseNo: number;
	status: 'Live - Primary' | 'Dissolved' | 'Archived';
	members: RawCommitteeMember[];
};
