/** @format */

import { initializeAttendanceSummary } from '@/functions/attendance/_utils/init_attendance_summary';
import { GroupType, URIpair } from '@/models/_utils';
import {
	CommitteeAttendance,
	GroupAttendanceRecord,
} from '@/models/attendance';
import { addPresentPercentage } from '../add_percentage_calculations';
import { dateToYMDstring } from '@/functions/_utils/dates';

function aggregateGroupAttendance(
	group_type: GroupType,
	records: CommitteeAttendance[]
): GroupAttendanceRecord {
	const year = records[0].date.getFullYear();
	const uri = `${records[0].uri ?? group_type}`;
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

			const month =
				record.date instanceof Date
					? record.date.getMonth()
					: new Date(record.date).getMonth();

			const date =
				record.date instanceof Date
					? dateToYMDstring(record.date)
					: record.date;

			// Use normalizedStatus to access the correct property
			summary[normalizedStatus][month].push({
				uri: member.uri,
				date: date,
			});
		};

		// Update summary for each member status.
		record.present.forEach((member) => updateSummary(member, 'present'));
		record.absent?.forEach((member) => updateSummary(member, 'absent'));
		record.also_present?.forEach((member) =>
			updateSummary(member, 'alsoPresent')
		);
	});

	// Calculates and adds present percentages to obj
	const processed = addPresentPercentage(summary) as GroupAttendanceRecord;

	return processed;
}

export { aggregateGroupAttendance };
