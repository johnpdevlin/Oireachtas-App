/** @format */

import {
	CommitteeAttendance,
	GroupAttendanceRecord,
} from '@/models/attendance';
import { groupByURIandYear } from '../../_utils/group_by_uri_and_year';
import { aggregateGroupAttendance } from '../../_utils/aggregate_records/aggregate_group_attendance';

function aggregateCommitteeAttendanceRecords(
	records: CommitteeAttendance[]
): GroupAttendanceRecord[] {
	const groupedRecords = groupByURIandYear(records);
	const committeeRecords: GroupAttendanceRecord[] = [];
	// Iterate over each committee
	Object.values(groupedRecords).forEach((commRecords) => {
		// Iterates over records for each year to return consolidated year record
		Object.values(commRecords).forEach((v) => {
			const processed = aggregateGroupAttendance('committee', v);
			committeeRecords.push(processed);
		});
	});
	return committeeRecords;
}

export { aggregateCommitteeAttendanceRecords };
