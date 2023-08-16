/** @format */

import { ObjDateRange, StrDateRange } from '@/Models/dates';
import { BinaryChamber } from '../_utility';

export type Constituency = {
	name: string;
	chamber: BinaryChamber;
	uri: string;
	dateRangeStr: StrDateRange;
	dateRange: ObjDateRange;
	houses: number[];
};
