/** @format */

import { DateRange } from '@/models/dates';

export function sortByDateRange<T extends { dateRange: DateRange }>(
	a: T,
	b: T
) {
	const endDateA = a.dateRange.end;
	const endDateB = b.dateRange.end;

	// Convert end dates to Date objects if they are strings
	const dateA = endDateA
		? endDateA instanceof Date
			? endDateA
			: new Date(endDateA)
		: undefined;
	const dateB = endDateB
		? endDateB instanceof Date
			? endDateB
			: new Date(endDateB)
		: undefined;

	// Compare end dates
	if (!dateA && dateB) {
		return 1; // Undefined end date comes first
	}
	if (dateA && !dateB) {
		return -1; // Undefined end date comes first
	}
	if (dateA && dateB) {
		return dateB.getTime() - dateA.getTime(); // Sort by end date in descending order
	}
	// If both have undefined end dates, maintain current order
	return 0;
}
