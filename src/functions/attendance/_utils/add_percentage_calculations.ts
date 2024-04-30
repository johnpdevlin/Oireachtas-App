/** @format */

import {
	AttendanceRecord,
	GroupAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/attendance';
import { calculatePercentagePresent } from './calculate_percentage_present';

// Calculates overall percentage
// Iterates over months present/attendance to calculate percentage for each
function addPresentPercentage(
	record:
		| MemberIndCommAttendanceRecord
		| AttendanceRecord
		| GroupAttendanceRecord
): AttendanceRecord | GroupAttendanceRecord | MemberIndCommAttendanceRecord {
	const overallPercentage =
		calculatePercentagePresent(record.present, record.absent) ?? undefined;
	const monthsPercentage = (): (number | undefined)[] => {
		const months = [];
		for (let i = 0; i < 12; i++) {
			months[i] = calculatePercentagePresent(
				record.present[i],
				record.absent[i]
			) as number | undefined;
		}
		return months as (number | undefined)[];
	};
	return {
		...record,
		present_percentage: {
			overall: overallPercentage,
			months: monthsPercentage(),
		},
	};
}

export { addPresentPercentage };
