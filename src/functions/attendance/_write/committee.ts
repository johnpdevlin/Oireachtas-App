/** @format */

import fetchHouses from '@/functions/APIs/Oireachtas/house/_index';
import { processCommitteeAttendanceBetweenDates } from '../commitee/_index';
import { exportRecordToFirestore } from './_utils';

const exportCommitteeAttendanceRecords = async (
	house_no: number
): Promise<void> => {
	const chamber = 'dail';
	const collection = 'committee';

	try {
		const house = await fetchHouses({ chamber, house_no });
		console.info(
			`Beginning exporting of ${collection} attendance records for ${
				house[0].showAs
			} from ${house[0].dateRange.start}-${house[0].dateRange.end ?? 'present'}`
		);
		const periods = splitPeriods(
			house[0].dateRange.start,
			house[0].dateRange.end ?? undefined
		);
		for (const period of periods) {
			console.info(
				`Processing period from ${period.start} - ${period.end} for ${house[0].showAs}`
			);
			const records = await processCommitteeAttendanceBetweenDates(
				house_no,
				period.start,
				period.end
			);

			console.info(`Exporting ${records.length} records to Firestore.`);

			for (const rec of records) {
				await exportRecordToFirestore('committee', rec);
			}

			console.info(
				`Period from ${period.start} - ${period.end} for ${house[0].showAs} processed and exported successfully.`
			);
		}

		console.info('All records procsessed and exported successfully.');
	} catch (error) {
		console.error('Error exporting records to Firestore:', error);
	}
};

const splitPeriods = (
	start: string,
	end = `${new Date().getFullYear()}-01-01`
): { start: string; end: string }[] => {
	const startDate = new Date(start);
	const endDate = new Date(end);

	const startYear = startDate.getFullYear();
	const endYear = endDate.getFullYear();

	const completeYears: { start: string; end: string }[] = [];

	for (let year = startYear; year <= endYear; year++) {
		const yearStartDate = new Date(year, 0, 1);
		const yearEndDate = new Date(year, 11, 31);

		const yearStart =
			year === startYear
				? startDate.toISOString().split('T')[0]
				: yearStartDate.toISOString().split('T')[0];
		const yearEnd =
			year === endYear
				? endDate.toISOString().split('T')[0]
				: yearEndDate.toISOString().split('T')[0];

		completeYears.push({ start: yearStart, end: yearEnd });
	}

	return completeYears;
};

export { exportCommitteeAttendanceRecords };
