/** @format */

import { SittingDaysReport } from '@/models/scraped/attendance';

/** @format */
export type SittingDates = {
	uri?: string;
	sittingDates: (string | undefined)[];
	otherDates: (string | undefined)[];
};
export function mergeMemberAttendanceRecords(
	data: SittingDaysReport[]
): SittingDates[] {
	// Create an empty array to store the merged results
	const result: SittingDates[] = [];

	// Iterate over each item in the data array
	for (const item of data) {
		// Check if there is an existing item with the same URI in the result array
		const existingItem = result.find((x) => x.uri === item.uri);

		// If an existing item is found, merge the sittingDates and otherDates arrays
		if (existingItem) {
			existingItem.sittingDates = [
				...existingItem.sittingDates,
				...item.sittingDates,
			];
			existingItem.otherDates = [
				...existingItem.otherDates,
				...item.otherDates,
			];
		} else {
			// If no existing item is found, create a new item with the URI, sittingDates, and otherDates
			result.push({
				uri: item.uri,
				sittingDates: item.sittingDates,
				otherDates: item.otherDates,
			});
		}
	}

	// Return the merged results
	return result;
}
