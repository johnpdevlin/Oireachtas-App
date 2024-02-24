/** @format */

import scrapeSittingReportsForChamber from '@/functions/attendance/house/report/_house_attendance';
import { HouseRequest } from '@/models/oireachtasApi/house';
import { BinaryChamber, Chamber } from '@/models/_utils';
import { SittingDaysRecord } from '@/models/attendance';
import fetchHouses from '../../APIs/Oireachtas/house/_index';

// Processes attendance reports for a specified chamber and term based on house details and date range
export default async function processChamberAttendanceReportsByTerm(
	house?: { chamber: Chamber; house_no: number },
	dates?: { date_start: string; date_end: string }
): Promise<SittingDaysRecord[]> {
	// Validate if house information is provided
	if (!house) {
		console.warn('No house information provided.');
		return [];
	}

	try {
		// Fetch house details based on provided house information
		const houseDetails = await fetchHouses({
			chamber: house.chamber,
			house_no: house.house_no,
		} as HouseRequest);

		// Validate the fetched house details
		if (houseDetails.length !== 1) {
			console.warn('Invalid house details or multiple houses found.');
			return [];
		}

		// Scrape attendance reports for the specified chamber and house number
		const records = await scrapeSittingReportsForChamber(
			house.chamber as BinaryChamber,
			house.house_no
		);

		// Check if reports are successfully scraped
		if (records.length === 0) {
			console.warn('No reports returned for the provided house and term.');
		}

		return records;
	} catch (err) {
		// Handle errors during the processing of attendance reports
		console.error('Error processing chamber attendance reports:', err);
		return [];
	}
}
