/** @format */

import { DateRange } from '@/models/dates';

export function getCurrentAndPastMemberships<
	T extends { dateRange: DateRange }
>(items: T[]): { current: T[]; past: T[] } {
	// Filter the items to separate current and past items
	const currentItems = items.filter((item) => !item.dateRange.end);
	const pastItems = items.filter((item) => item.dateRange.end);

	// Sort the past items by the most recent end date
	pastItems.sort((a, b) => {
		const endDateA = a.dateRange.end ? new Date(a.dateRange.end) : null;
		const endDateB = b.dateRange.end ? new Date(b.dateRange.end) : null;
		return (endDateB as any) - (endDateA as any);
	});

	return { current: currentItems, past: pastItems };
}
