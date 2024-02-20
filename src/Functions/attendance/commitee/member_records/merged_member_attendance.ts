/** @format */

import { groupObjectsByProperty } from '@/functions/_utils/objects';

import {
	CommitteeAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/committee';

function getMergedMemberAttRecords(
	records: MemberIndCommAttendanceRecord[]
): CommitteeAttendanceRecord[] {
	const members = groupObjectsByProperty(records, 'uri');
	const merged = members
		.map((member) => mergeMemberRecords(member))
		.map((member) => member[0]);

	return merged;
}

function mergeMemberRecords(
	records: MemberIndCommAttendanceRecord[]
): CommitteeAttendanceRecord[] {
	const years = groupObjectsByProperty(records, 'year');
	const processed = years.map((rec) => {
		return aggregateAttendance(rec);
	});

	return processed;
}

function aggregateAttendance(
	records: MemberIndCommAttendanceRecord[]
): CommitteeAttendanceRecord {
	// Aggregate attendance data
	const aggregated: CommitteeAttendanceRecord = {
		uri: records[0].uri,
		record_uri: `${records[0].uri}-${records[0].year}-overall-comm-attenance`,
		year: records[0].year,
		group_type: 'member',
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};

	records.forEach((record) => {
		// Aggregate for each month
		for (let month = 0; month < 12; month++) {
			// Ensure we don't access undefined arrays
			if (record.present[month]) {
				aggregated.present[month] = aggregated.present[month].concat(
					record.present[month]
				);
			}
			if (record.absent[month]) {
				aggregated.absent[month] = aggregated.absent[month].concat(
					record.absent[month]
				);
			}
			if (record.also_present[month]) {
				aggregated.also_present[month] = aggregated.also_present[month].concat(
					record.also_present[month]
				);
			}
		}
	});

	return aggregated;
}

export { getMergedMemberAttRecords };
