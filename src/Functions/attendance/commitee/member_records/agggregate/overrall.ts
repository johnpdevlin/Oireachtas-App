/** @format */

import { addPresentPercentage } from '@/functions/attendance/_utils/add_percentage_calculations';
import { initializeAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';
import { AttendanceRecord } from '@/models/attendance';
import { MemberIndCommAttendanceRecord } from '@/models/attendance';

function aggregateMemberAttendance(
	records: MemberIndCommAttendanceRecord[]
): AttendanceRecord[] {
	const aggregatedRecordsMap: Map<string, AttendanceRecord> = new Map();

	records.forEach((record) => {
		const recordKey = `${record.uri}-${record.year}`;
		let aggregated = aggregatedRecordsMap.get(recordKey);

		if (!aggregated) {
			// if doesn't exist create new object
			aggregated = initializeAttendanceSummary(
				record.uri,
				record.year!,
				'member'
			);
			aggregatedRecordsMap.set(recordKey, aggregated);
		}

		// Aggregate monthly data for present, absent, and also_present.
		const statuses: (keyof MemberIndCommAttendanceRecord)[] = [
			'present',
			'absent',
			'also_present',
		];

		statuses.forEach((status: string) => {
			if (
				status === 'present' ||
				status === 'absent' ||
				status === 'also_present'
			) {
				for (let month = 0; month < 12; month++) {
					if (record[status][month]) {
						aggregated![status][month].push(...record[status][month]);
					}
				}
			}
		});
	});

	// Convert the map back to an array

	return Array.from(aggregatedRecordsMap.values()).map((record) => {
		return addPresentPercentage(record);
	});
}

export { aggregateMemberAttendance };
