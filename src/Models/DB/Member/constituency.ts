/** @format */

import { DateRangeObj, DateRangeStr } from '@/Models/dates';
import { BinaryChamber } from '../../_utility';

export type MemberConstituency = {
	name: string;
	chamber: BinaryChamber;
	uri: string;
	dateRangeStr: DateRangeStr;
	dateRange: DateRangeObj;
	houses: number[];
};
