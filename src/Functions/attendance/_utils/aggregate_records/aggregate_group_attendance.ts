/** @format */

import { initializeGroupAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';
import { GroupType, URIpair } from '@/models/_utils';
import {
	CommitteeAttendance,
	GroupAttendanceRecord,
} from '@/models/attendance';
import { addPresentPercentage } from '../add_percentage_calculations';

function aggregateGroupAttendance(
	group_type: GroupType,
	records: CommitteeAttendance[]
): GroupAttendanceRecord {
	const year = records[0].date.getFullYear();
	const uri = `${records[0].uri ?? group_type}`;
	const summary = initializeGroupAttendanceSummary(
		uri,
		year,
		group_type
	) as GroupAttendanceRecord;

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: URIpair,
			status: 'present' | 'absent' | 'also_present'
		) => {
			const month = record.date.getMonth();
			const date = new Date(record.date); // Convert date to string here

			// Use normalizedStatus to access the correct property
			summary[status][month].push({
				uri: member.uri,
				date: date, // Assign the converted date string here
			});
		};

		// Update summary for each member status.
		record.present.forEach((member) => updateSummary(member, 'present'));
		record.absent?.forEach((member) => updateSummary(member, 'absent'));
		record.also_present?.forEach((member) =>
			updateSummary(member, 'also_present')
		);
	});

	// Calculates and adds present percentages to obj
	const processed = addPresentPercentage(summary) as GroupAttendanceRecord;

	return processed;
}

export { aggregateGroupAttendance };
