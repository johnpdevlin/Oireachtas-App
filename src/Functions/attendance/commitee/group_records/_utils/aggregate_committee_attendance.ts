/** @format */

import { GroupType, MemberBaseKeys } from '@/models/_utils';
import {
	CommitteeAttendance,
	GroupAttendanceRecord,
} from '@/models/attendance';

type MemberAtt = { uri: string; house_code: string; date: Date };

function aggregateCommitteeGroupAttendance(
	group_type: GroupType,
	records: CommitteeAttendance[]
): GroupAttendanceRecord {
	const year = records[0].date.getFullYear();
	const uri = `${records[0].uri}-${year}`;
	const summary = initializeGroupAttendanceSummary(
		records[0],
		group_type,
		uri,
		year
	);

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: MemberBaseKeys,
			status: 'present' | 'absent' | 'alsoPresent'
		) => {
			// Normalize the status to match the property names in MemberCommitteeAttendance
			const normalizedStatus =
				status === 'alsoPresent' ? 'also_present' : status;

			const month = record.date.getMonth();
			// Use normalizedStatus to access the correct property
			summary[normalizedStatus][month].push({
				uri: member.uri,
				house_code: member.house_code,
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

	return summary;
}
// Initialize attendance arrays for a new summary object.
function initializeGroupAttendanceSummary(
	record: CommitteeAttendance,
	group_type: GroupType,
	uri: string,
	year: number
): GroupAttendanceRecord {
	const present: MemberAtt[][] = Array.from({ length: 12 }, () => []);
	const alsoPresent: MemberAtt[][] = Array.from({ length: 12 }, () => []);
	const absent: MemberAtt[][] = Array.from({ length: 12 }, () => []);

	return {
		group_type: group_type,
		record_uri: uri,
		uri: record.uri,
		year,
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};
}
export { aggregateCommitteeGroupAttendance };
