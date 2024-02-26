/** @format */

import { SittingDaysRecord } from '@/models/attendance';
function getPossibleSittingDates(records: SittingDaysRecord[]): Date[] {
	const possibleDates = new Map<string, Date>();
	records.forEach((record) => {
		record.sittingDates.forEach((date) => {
			if (date!) {
				// Check if date is neither null nor undefined
				possibleDates.set(date, new Date(date));
			}
		});
	});
	return Array.from(possibleDates.values());
}

export { getPossibleSittingDates };
