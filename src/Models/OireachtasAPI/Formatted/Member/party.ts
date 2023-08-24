/** @format */

import { DateRangeObj, DateRangeStr } from '@/models/dates';

export type MemberParty = {
	name: string;
	uri: string;
	dateRange: DateRangeStr;
	houses: number[];
};
