/** @format */

import { MemberBaseKeys } from '@/models/_utils';
import {
	CommitteeAttendance,
	GroupCommitteeAttendanceRecord,
} from '@/models/committee';
import { groupByURIandYear } from '../../_utils/group_by_uri_and_year';

function aggregateCommitteeAttendanceRecords(
	records: CommitteeAttendance[]
): GroupCommitteeAttendanceRecord[] {
	const groupedRecords = groupByURIandYear(records);
	const committeeRecords: GroupCommitteeAttendanceRecord[] = [];
	// Iterate over each committee
	Object.values(groupedRecords).forEach((commRecords) => {
		// Iterates over records for each year to return consolidated year record
		Object.values(commRecords).forEach((v) => {
			const processed = aggregateAttendance(v);
			committeeRecords.push(processed);
		});
	});
	return committeeRecords;
}

type MemberAtt = { uri: string; house_code: string; date: Date };

function aggregateAttendance(
	records: CommitteeAttendance[]
): GroupCommitteeAttendanceRecord {
	const year = records[0].date.getFullYear();
	const uri = `${records[0].uri}-${year}`;
	const summary = initializeAttendanceSummary(records[0], uri, year);

	records.forEach((record) => {
		const year = record.date.getFullYear();

		const updateSummary = (
			member: MemberBaseKeys,
			status: 'present' | 'absent' | 'alsoPresent'
		) => {
			// Normalize the status to match the property names in MemberCommitteeAttendance
			const normalizedStatus =
				status === 'alsoPresent' ? 'also_present' : status;

			const key = `${member.uri}-${record.date}`;
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
function initializeAttendanceSummary(
	record: CommitteeAttendance,
	uri: string,
	year: number
): GroupCommitteeAttendanceRecord {
	const present: MemberAtt[][] = Array.from({ length: 12 }, () => []);
	const alsoPresent: MemberAtt[][] = Array.from({ length: 12 }, () => []);
	const absent: MemberAtt[][] = Array.from({ length: 12 }, () => []);

	return {
		group_type: 'committee',
		record_uri: uri,
		uri: record.uri,
		year,
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};
}

export { aggregateCommitteeAttendanceRecords };
