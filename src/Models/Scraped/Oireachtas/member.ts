/** @format */

import { MemberOirProfile } from '@/Functions/ScrapeWebsites/Oireachtas/Member/Get/Profile/memberProfile';

export type OirData = MemberOirProfile & {
	committees: { current?: MemberCommittee[]; past?: MemberCommittee[] };
};

import { BinaryChamber } from '@/Models/_util';
import { DateRangeObj, DateRangeStr } from '@/Models/dates';

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
