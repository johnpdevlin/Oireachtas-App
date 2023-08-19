/** @format */
import {
	ConstituencyOrPanel,
	ConstituencyRequest,
} from '@/Models/OireachtasAPI/constituency';

import axios from 'axios';

export default async function fetchConstituencies(
	props: ConstituencyRequest // Props object with request parameters
): Promise<ConstituencyOrPanel[] | undefined> {
	// Construct the URL for the constituencies API with the request parameters
	const url: string = `https://api.oireachtas.ie/v1/constituencies?chamber_id=&chamber=${
		props.chamber // Chamber ID
	}&house_no=${props.house_no}&limit=${props.limit ?? 80}`;

	try {
		const response = await axios.get(url);
		return response.data.results.house.constituenciesOrPanels;
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}
