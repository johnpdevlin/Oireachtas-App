/** @format */

import { MemberOirProfile } from '@/functions/scrape_websites/oireachtas/td/get/profile/td_profile';

export type OirData = MemberOirProfile & {
	committees: { current?: MemberCommittee[]; past?: MemberCommittee[] };
};

import { BinaryChamber } from '@/models/_utils';
import { DateRangeStr } from '@/models/dates';

export type MemberCommittee = {
	name: string;
	uri: string;
	chamber: BinaryChamber;
	houseNo: number;
	dateRange: DateRangeStr;
};

export type MemberParty = {
	name: string;
	uri: string;
	dateRange: DateRangeStr;
};
