/** @format */

import { GroupType } from '../_utils';
import { AttendanceRecord } from '../attendance';

export type AttendanceData = {
	house: Record<GroupType, AttendanceRecord[]>;
	committee: Record<GroupType, AttendanceRecord[]>;
};
