/** @format */

import fetchHouses from '@/Functions/API-Calls/OireachtasAPI/houses';
import scrapeSittingReportsForChamber from '@/Functions/GetWebsiteData/Oireachtas/scrapeSittingReportsForChamber';

import HouseRequest from '@/Models/OireachtasAPI/Request/houseRequest';
import { House } from '@/Models/OireachtasAPI/Response/houseResponse';
import { Chamber } from '@/Models/_utility';
import axios from 'axios';

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
			const res = await axios.get(
				`api/crawl-sitting-reports?chamber=${house.chamber}&house_no=${house.house_no}`
			);
			console.log(res.data);
		}
	}
}
