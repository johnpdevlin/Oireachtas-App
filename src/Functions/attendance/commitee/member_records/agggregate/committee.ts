/** @format */

import { addPresentPercentage } from '@/functions/attendance/_utils/add_percentage_calculations';
import { URIpair } from '@/models/_utils';
import {
	CommitteeAttendance,
	MemberIndCommAttendanceRecord,
} from '@/models/attendance';

function aggregateMemberCommAttendance(
	records: CommitteeAttendance[]
): MemberIndCommAttendanceRecord[] {
	const summaries: Record<string, MemberIndCommAttendanceRecord> = {};

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: URIpair,
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
		};

		// Update summary for each member status.
		record.present.forEach((member) => updateSummary(member, 'present'));
		record.absent?.forEach((member) => updateSummary(member, 'absent'));
		record.also_present?.forEach((member) =>
			updateSummary(member, 'alsoPresent')
		);
	});

	// Calculates and adds present percentages to each record
	return Object.values(summaries).map((sum) => {
		return addPresentPercentage(sum) as MemberIndCommAttendanceRecord;
	});
}

// Initialize attendance arrays for a new summary object.
function initializeAttendanceSummary(
	member: URIpair,
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
	};
}

export { aggregateMemberCommAttendance };
