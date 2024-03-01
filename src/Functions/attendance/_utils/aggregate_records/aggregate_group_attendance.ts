/** @format */

import { initializeAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';
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
	const uri = `${records[0].uri}-${year}`;
	const summary = initializeAttendanceSummary(
		uri,
		year,
		group_type
	) as GroupAttendanceRecord;

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: URIpair,
			status: 'present' | 'absent' | 'alsoPresent'
		) => {
			// Normalize the status to match the property names in MemberCommitteeAttendance
			const normalizedStatus =
				status === 'alsoPresent' ? 'also_present' : status;

			const month = record.date.getMonth();
			// Use normalizedStatus to access the correct property
			summary[normalizedStatus][month].push({
				uri: member.uri,
				date: record.date,
			});
		};

		// Update summary for each member status.
		record.present.forEach((member) => updateSummary(member, 'present'));
		record.absent?.forEach((member) => updateSummary(member, 'absent'));
		record.alsoPresent?.forEach((member) =>
			updateSummary(member, 'alsoPresent')
		);
	});

	// Calculates and adds present percentages to obj
	const processed = addPresentPercentage(summary) as GroupAttendanceRecord;

	return processed;
}

export { aggregateGroupAttendance };
