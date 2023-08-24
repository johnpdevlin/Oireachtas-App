/** @format */

import { BinaryChamber } from '../../../_utils';
import { DateRangeStr } from '../../../dates';

export type OfficeType = 'junior' | 'senior';

export type MemberOffice = {
	name: string;
	type: OfficeType;
	chamber: BinaryChamber;
	houseNo: number;
	chamberStr: string;
	dateRange: DateRangeStr;
};
