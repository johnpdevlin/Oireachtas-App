/** @format */

import { GroupType } from '@/models/_utils';
import { AttendanceRecord, GroupAttendanceRecord } from '@/models/attendance';

export function initializeAttendanceSummary(
	uri: string,
	year: number,
	group_type: GroupType
): GroupAttendanceRecord | AttendanceRecord {
	return {
		uri: `${
			group_type === ('dail' || 'seanad') ? `${group_type}-${uri}` : uri
		}`,
		record_uri: `${group_type}-${uri}-${year}`,
		year: year,
		group_type: group_type,
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};
}
