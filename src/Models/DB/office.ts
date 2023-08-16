/** @format */

import { BinaryChamber } from '../_utility';
import { DateRangeObj, DateRangeStr } from '../dates';

export type OfficeType = 'junior' | 'senior';

export type MemberOffice = {
	name: string;
	type: OfficeType;
	chamber: BinaryChamber;
	houseNo: number;
	chamberStr: string;
	dateRange: DateRangeObj;
	dateRangeStr: DateRangeStr;
};
