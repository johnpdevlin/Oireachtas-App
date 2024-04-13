/** @format */

import { House, HouseRequest } from '@/models/oireachtas_api/house';
import axios from 'axios';

export default async function fetchHouses(
	props: HouseRequest
): Promise<House[]> {
	// construct request
	const url: string = `https://api.oireachtas.ie/v1/houses?chamber_id=${
		props.house_no
			? `https://data.oireachtas.ie/ie/oireachtas/house/${props.chamber}/${props.house_no}`
			: ''
	}${props.chamber ? `&chamber=${props.chamber}` : ''}&limit=500`;

	try {
		let houses = (await axios.get(url)).data.results;

		return houses.map((obj: { house: House }) => obj.house) as House[]; // remove unnceccesary outer objects
	} catch (err) {
		console.log('Error. Props:', props, ` URL: ${url}`);
		console.log(err);
	}

	return [];
}
