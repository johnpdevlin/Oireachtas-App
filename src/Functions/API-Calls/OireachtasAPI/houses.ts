/** @format */

import HouseRequest from '@/Models/OireachtasAPI/Request/house';
import {
	House,
	HouseResult,
} from '@/Models/OireachtasAPI/Response/houseResponse';
import fetcher from '..';

export default async function fetchHouses(
	props: HouseRequest
): Promise<House[]> {
	// construct request
	const url: string = `https://api.oireachtas.ie/v1/houses?chamber_id=${
		props.chamber
			? `https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fhouse%2F${props.chamber}%2F${props.house_no}`
			: ''
	}&limit=500`;

	try {
		let houses: HouseResult[] = (await fetcher(url)).results;
		// remove unnceccesary outer objects
		return houses.map((obj) => obj.house) as House[];
	} catch (err) {
		console.log('Error. Props:', props, ` URL: ${url}`);
		console.log(err);
	}

	return [];
}
