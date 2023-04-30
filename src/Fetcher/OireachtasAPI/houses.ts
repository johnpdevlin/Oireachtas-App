/** @format */

import fetcher from '..';
import { houseRequest } from '../../Models/apiRequests';
import house from '../../Models/house';
import formatHouse from './Formatter/house';

export default async function fetchHouses(
	props: houseRequest
): Promise<any[] | house> {
	const url: string = `https://api.oireachtas.ie/v1/houses?chamber_id=${
		props.chamber
			? `https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fhouse%2F${props.chamber}%2F${props.houseNo}`
			: ''
	}&limit=500`;

	let houses = (await fetcher(url)).results;

	if (props.formatted != false) {
		const h: house = await formatHouse(houses[0]);
		return h;
	} else {
		return houses;
	}
}
