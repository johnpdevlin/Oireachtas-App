/** @format */

import house from '../../../Models/house';

export default async function formatHouse(h: any): Promise<house> {
	// Formats data from Oireachtas API
	let house = h.house;
	let end: Date | null;

	// checks for null or undefined values
	if (!house.dateRange.end) {
		end = null;
	} else {
		end = new Date(house.dateRange.end);
	}

	house: house = {
		name: house.showAs,
		uri: `${house.chamberCode}-${house.houseNo}`,
		chamber: house.chamberCode,
		houseNo: house.houseNo,
		seats: house.seats,
		startDate: new Date(house.dateRange.start),
		endDate: end,
	};

	return house;
}
