/** @format */

import { BinaryChamber } from '../../../_utils';
import { DateRangeStr } from '../../../dates';

export type OfficeType = 'junior' | 'senior';

export type MemberOffice = {
	name: string;
	type: OfficeType;
	houseNos: number[];
	dateRange: DateRangeStr;
};

export type UnchangingSeniorMinistries =
	| 'for Finance'
	| 'Public Expenditure'
	| 'for Foreign Affairs'
	| 'for Justice'
	| 'for Health'
	| 'for Defense'
	| 'for Education'
	| 'for Agriculture';
