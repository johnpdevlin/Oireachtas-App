/** @format */

import { Chamber, CommitteeType, URIpair } from './_utility';

export type PastCommitteeMember = {
	dateRange: {
		date_start: Date;
		date_end: Date;
	};
} & URIpair;

export type Committee = {
	name: string;
	uri: string;
	url: string;
	chamber: Exclude<Chamber, 'dail & seanad'>;
	types: CommitteeType[];
	dail_no: number;
	chair: URIpair;
	members: URIpair[];
	pastMembers?: PastCommitteeMember[];
} & Partial<ExpiredDetails>;

export type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
	endDate: Date;
};
