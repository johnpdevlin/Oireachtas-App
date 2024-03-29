/** @format */

import { BinaryChamber } from '@/models/_utils';
import { processHouseAttendanceByTerm } from '../house/_index';
import { exportRecordToFirestore } from './_utils';
import fetchHouses from '@/functions/APIs/Oireachtas/house/_index';
import { groupObjectsByProperty } from '../../_utils/objects';

const exportHouseAttendanceRecords = async (
	chamber: BinaryChamber,
	house_no: number
): Promise<void> => {
	console.info('Beggining exporting of house attendance records.');
	const collection = 'house';

	try {
		const house = await fetchHouses({ chamber, house_no });
		console.info(
			`Beginning exporting of ${collection} attendance records for ${
				house[0].showAs
			} from ${house[0].dateRange.start}-${house[0].dateRange.end ?? 'present'}`
		);

		const records = (await processHouseAttendanceByTerm(chamber, house_no))
			.records;
		const groupedByYear = groupObjectsByProperty(records, 'year');

		for (const recordByYear of groupedByYear) {
			setTimeout(() => {}, 2000);
			console.info(
				`Processing ${recordByYear[0].year} ${collection} attendance records for ${house[0].showAs}`
			);

			console.info(
				`Exporting ${recordByYear.length} ${collection} attendance records to Firestore.`
			);

			for (const rec of recordByYear) {
				await exportRecordToFirestore(collection, rec);
			}

			console.info(
				`${recordByYear[0].year} ${collection} attendance records for ${house[0].showAs} processed and exported successfully.`
			);
		}

		console.info(
			`All ${collection} attendance records procsessed and exported successfully.`
		);
	} catch (error) {
		console.error('Error exporting records to Firestore:', error);
	}
};

export { exportHouseAttendanceRecords };
