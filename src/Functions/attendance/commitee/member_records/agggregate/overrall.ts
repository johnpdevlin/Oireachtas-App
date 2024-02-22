/** @format */

import {
	CommitteeAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/committee';

function aggregateMemberAttendance(
	records: MemberIndCommAttendanceRecord[]
): CommitteeAttendanceRecord[] {
	const aggregatedRecordsMap: Map<string, CommitteeAttendanceRecord> =
		new Map();

	records.forEach((record) => {
		const recordKey = `${record.uri}-${record.year}`;
		let aggregated = aggregatedRecordsMap.get(recordKey);

		if (!aggregated) {
			// if doesn't exist create new object
			aggregated = initializeAttendanceSummary(record);
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
	return Array.from(aggregatedRecordsMap.values());
}

function initializeAttendanceSummary(
	record: MemberIndCommAttendanceRecord
): CommitteeAttendanceRecord {
	return {
		uri: record.uri,
		record_uri: `${record.uri}-${record.year}-overall-comm-attenance`,
		year: record.year,
		group_type: 'member',
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};
}

export { aggregateMemberAttendance };
