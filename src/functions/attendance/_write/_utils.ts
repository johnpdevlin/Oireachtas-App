/** @format */

import { writeObjToFirestore } from '@/FirestoreDB/write';
import { AttendanceRecord } from '@/models/attendance';

export const exportRecordToFirestore = async (
	collection: 'house' | 'committee',
	record: AttendanceRecord
): Promise<void> => {
	try {
		await writeObjToFirestore(`${collection}-attendance`, {
			record_uri: record.record_uri,
			uri: record.uri,
			group_type: record.group_type,
			date_range: record.dateRange,
			year: record.year,
			present_percentage: record.present_percentage,
			present: formatAttDates(
				record.present,
				record.present_percentage?.months
			),
			absent: formatAttDates(record.absent, record.present_percentage?.months),
			also_present: formatAlsoDates(record.also_present),
		});
	} catch (error) {
		console.error(
			`${record.record_uri} not exported successfully. Error:`,
			error
		);
	}
};

const formatAttDates = (
	dates: Date[][],
	percentages?: (number | undefined)[] | undefined
): (number | undefined)[] => {
	return dates.map((dt, index) => {
		return percentages && percentages[index] !== undefined
			? dt.length
			: undefined;
	});
};

const formatAlsoDates = (dates: Date[][]) => {
	return dates.map((dt) => dt.length ?? 0);
};
