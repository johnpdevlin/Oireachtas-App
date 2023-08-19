/** @format */

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
