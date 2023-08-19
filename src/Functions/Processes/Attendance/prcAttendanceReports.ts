/** @format */

import fetchHouses from '@/Functions/API-Calls/OireachtasAPI/houses';
import scrapeSittingReportsForChamber from '@/Functions/GetWebsiteData/Oireachtas/Attendance/House/scrapeSittingReports';
import { House, HouseRequest } from '@/Models/OireachtasAPI/house';
import { Chamber } from '@/Models/_utility';

export default async function prcAttendanceReports(
	house?: { chamber: Chamber; house_no: number },
	dates?: { date_start: string; date_end: string }
) {
	// dates in formats 01-january-2023
	if (house !== undefined) {
		const houseDetails: House[] = await fetchHouses({
			chamber: house.chamber,
			house_no: house.house_no,
		} as unknown as HouseRequest);
		if (houseDetails.length === 1) {
			try {
				const reports = scrapeSittingReportsForChamber(
					house.chamber,
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
