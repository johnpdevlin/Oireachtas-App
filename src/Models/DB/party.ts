/** @format */

import { ObjDateRange, StrDateRange } from '../dates';

export type MemberParty = {
	name: string;
	uri: string;
	dateRangeStr: StrDateRange;
	dateRange: ObjDateRange;
};
