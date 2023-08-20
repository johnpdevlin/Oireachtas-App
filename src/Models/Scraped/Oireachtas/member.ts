/** @format */

import { MemberOirProfile } from '@/functions/scrape_websites/oireachtas/member/get/profile/member_profile';

export type OirData = MemberOirProfile & {
	committees: { current?: MemberCommittee[]; past?: MemberCommittee[] };
};

import { BinaryChamber } from '@/models/_utils';
import { DateRangeObj, DateRangeStr } from '@/models/dates';

export type MemberCommittee = {
	name: string;
	uri: string;
	chamber: BinaryChamber;
	houseNo: number;
	dateRange: DateRangeObj;
	dateRangeStr: DateRangeStr;
};

export type MemberParty = {
	name: string;
	uri: string;
	dateRangeStr: DateRangeStr;
	dateRange: DateRangeObj;
};
