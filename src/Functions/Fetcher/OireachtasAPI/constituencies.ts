/** @format */
import { ConstituencyRequest } from '@/Models/OireachtasAPI/Request/constitRequest';
import fetcher from '..';
import { ConstituencyOrPanelApiResponse } from '@/Models/OireachtasAPI/Response/constitResponse';

export default async function fetchConstituencies(
	props: ConstituencyRequest // Props object with request parameters
): Promise<any[]> {
	// Construct the URL for the constituencies API with the request parameters
	const url: string = `https://api.oireachtas.ie/v1/constituencies?chamber_id=&chamber=${
		props.chamber_id // Chamber ID
	}&house_no=${props.house_no}&limit=${props.limit ?? 80}`;

	// Fetch data from the constituencies API using the constructed URL
	let constits: ConstituencyOrPanelApiResponse = await fetcher(url);

	// Extract the constituencies from the API response and return them as an array
	return constits.results.house.constituenciesOrPanels;
}
