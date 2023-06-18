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
		props.house_no
			? `https://data.oireachtas.ie/ie/oireachtas/house/${props.chamber}/${props.house_no}`
			: ''
	}${props.chamber ? `&chamber=dail` : ''}&limit=500`;

	try {
		let houses: HouseResult[] = (await fetcher(url)).results;

		return houses.map((obj) => obj.house) as House[]; // remove unnceccesary outer objects
	} catch (err) {
		console.log('Error. Props:', props, ` URL: ${url}`);
		console.log(err);
	}

	return [];
}
