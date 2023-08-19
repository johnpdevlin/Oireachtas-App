/** @format */
import { DateRangeStr, DateRangeObj } from '@/Models/dates';

export type MemberParty = {
	name: string;
	uri: string;
	dateRangeStr: DateRangeStr;
	dateRange: DateRangeObj;
};
