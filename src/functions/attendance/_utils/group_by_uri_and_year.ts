/** @format */

import { groupByNested } from '@/functions/_utils/objects';

// Returns committeeURI: year: { record}[]
export function groupByURIandYear<T extends { date: Date; uri: string }>(
	records: T[]
) {
	return groupByNested<T>(records, (record) => {
		const year = record.date.getFullYear().toString();
		return [record.uri, year];
	});
}
