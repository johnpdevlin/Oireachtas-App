/** @format */

import scrapeSittingReportsForChamber from '@/functions/scrape_websites/oireachtas/attendance/house/scrape_sitting_reports';
import { House, HouseRequest } from '@/models/oireachtasApi/house';
import { BinaryChamber, Chamber } from '@/models/_utils';
import { SittingDaysReport } from '@/models/scraped/attendanceReport';
import fetchHouses from '@/functions/APIs_/Oireachtas_/house_/get_';

export default async function prcAttendanceReports(
	house?: { chamber: Chamber; house_no: number },
	dates?: { date_start: string; date_end: string }
): Promise<SittingDaysReport[] | void> {
	// dates in formats 01-january-2023
	if (house !== undefined) {
		const houseDetails: House[] = await fetchHouses({
			chamber: house.chamber,
			house_no: house.house_no,
		} as unknown as HouseRequest);
		if (houseDetails.length === 1) {
			try {
				const reports = scrapeSittingReportsForChamber(
					house.chamber as BinaryChamber,
					house.house_no
				);
				return reports;
			} catch (err) {
				console.warn(
					'Function seems unable to handle this Dáil term. Modification may be neccessary.'
				);
				console.error(err);
			}
		}
	}
}
