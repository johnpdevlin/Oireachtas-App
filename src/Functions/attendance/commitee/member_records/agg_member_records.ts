/** @format */

import { MemberBaseKeys } from '@/models/_utils';
import {
	CommitteeAttendance,
	MemberIndCommAttendanceRecord,
} from '@/models/committee';

function aggregateMemberAttendance(
	records: CommitteeAttendance[]
): MemberIndCommAttendanceRecord[] {
	const summaries: Record<string, MemberIndCommAttendanceRecord> = {};

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: MemberBaseKeys,
			status: 'present' | 'absent' | 'alsoPresent'
		) => {
			// Normalize the status to match the property names in MemberCommitteeAttendance
			const normalizedStatus =
				status === 'alsoPresent' ? 'also_present' : status;

			const key = `${member.uri}-${record.uri}-${year}`;
			if (!summaries[key]) {
				summaries[key] = initializeAttendanceSummary(member, record, year);
			}

			const summary = summaries[key];
			const month = record.date.getMonth();
			// Use normalizedStatus to access the correct property
			summary[normalizedStatus][month].push(record.date);

			// Update percentage_present after each update.
			summary.percentage_present = calculatePercentagePresent(summary);
		};

		// Update summary for each member status.
		record.present.forEach((member) => updateSummary(member, 'present'));
		record.absent?.forEach((member) => updateSummary(member, 'absent'));
		record.alsoPresent?.forEach((member) =>
			updateSummary(member, 'alsoPresent')
		);
	});

	return Object.values(summaries);
}

// Initialize attendance arrays for a new summary object.
function initializeAttendanceSummary(
	member: MemberBaseKeys,
	record: CommitteeAttendance,
	year: number
): MemberIndCommAttendanceRecord {
	return {
		record_uri: `${member.uri}-${record.uri}-${year}`,
		group_type: 'member',
		uri: member.uri,
		committee_type: record.type,
		committee_uri: record.uri,
		committee_name: record.name,
		committee_root_uri: record.rootURI,
		committee_root_name: record.rootName,
		year,
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
		percentage_present: 0,
	};
}

// Calculate the percentage of present days.
function calculatePercentagePresent(
	summary: MemberIndCommAttendanceRecord
): number {
	const totalPresentDays = summary.present.flat().length;
	const totalMeetingDays =
		totalPresentDays +
		summary.absent.flat().length +
		summary.also_present.flat().length;
	return totalMeetingDays > 0 ? (totalPresentDays / totalMeetingDays) * 100 : 0;
}

export { aggregateMemberAttendance };
