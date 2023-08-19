/** @format */

import { DateRangeObj, DateRangeStr } from '@/Models/dates';
import { BinaryChamber } from '../../../_util';

export type MemberConstituency = {
	name: string;
	chamber: BinaryChamber;
	uri: string;
	dateRangeStr: DateRangeStr;
	dateRange: DateRangeObj;
	houses: number[];
};
