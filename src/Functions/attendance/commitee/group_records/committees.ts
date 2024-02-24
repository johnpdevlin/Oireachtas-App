/** @format */

import {
	CommitteeAttendance,
	GroupCommitteeAttendanceRecord,
} from '@/models/committee';
import { groupByURIandYear } from '../_utils/group_by_uri_and_year';
import { aggregateAttendance } from './aggregate';

function aggregateCommitteeAttendanceRecords(
	records: CommitteeAttendance[]
): GroupCommitteeAttendanceRecord[] {
	const groupedRecords = groupByURIandYear(records);
	const committeeRecords: GroupCommitteeAttendanceRecord[] = [];
	// Iterate over each committee
	Object.values(groupedRecords).forEach((commRecords) => {
		// Iterates over records for each year to return consolidated year record
		Object.values(commRecords).forEach((v) => {
			const processed = aggregateAttendance('committee', v);
			committeeRecords.push(processed);
		});
	});
	return committeeRecords;
}

export { aggregateCommitteeAttendanceRecords };