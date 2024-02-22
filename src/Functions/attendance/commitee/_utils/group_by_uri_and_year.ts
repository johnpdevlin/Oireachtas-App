/** @format */

import { groupByNested } from '@/functions/_utils/objects';
import { CommitteeAttendance } from '@/models/committee';

// Returns committeeURI: year: { record}[]
export function groupByURIandYear(records: CommitteeAttendance[]) {
	return groupByNested<CommitteeAttendance>(records, (record) => {
		const year = record.date.getFullYear().toString();
		return [record.uri, year];
	});
}
