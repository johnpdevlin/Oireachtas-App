/** @format */

import { DateRangeObj, DateRangeStr } from '@/models/dates';
import { BinaryChamber } from '../../../_utils';

export type MemberConstituency = {
	name: string;
	chamber: BinaryChamber;
	uri: string;
	dateRangeStr: DateRangeStr;
	dateRange: DateRangeObj;
	houses: number[];
};
