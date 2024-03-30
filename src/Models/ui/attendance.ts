/** @format */

import { GroupType } from '../_utils';

export type AttendanceData = {
	house: Record<GroupType, AttendanceData[]>;
	committee: Record<GroupType, AttendanceData[]>;
};
