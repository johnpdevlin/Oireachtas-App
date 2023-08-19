/** @format */
import {
	ConstituencyOrPanel,
	ConstituencyRequest,
} from '@/Models/OireachtasAPI/Response/constituency';
import fetcher from '../fetcher';
import { ConstituencyOrPanelApiResponse } from '@/Models/OireachtasAPI/Response/constitResponse';

export default async function fetchConstituencies(
	props: ConstituencyRequest // Props object with request parameters
): Promise<ConstituencyOrPanel[]> {
	// Construct the URL for the constituencies API with the request parameters
	const url: string = `https://api.oireachtas.ie/v1/constituencies?chamber_id=&chamber=${
		props.chamber // Chamber ID
	}&house_no=${props.house_no}&limit=${props.limit ?? 80}`;

	try {
		const response = await axios.get(url);
		return response.data.results.map((house: RawOuterMember) => {
			return house.constituenciesOrPanels;
		});
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
	// Fetch data from the constituencies API using the constructed URL
	let constits: ConstituencyOrPanelApiResponse = await fetcher(url);

	// Extract the constituencies from the API response and return them as an array
	return constits.results.house.constituenciesOrPanels;
}

/** @format */
import {
	MemberRequest,
	RawMember,
	RawOuterMember,
} from '@/Models/OireachtasAPI/member';
import axios from 'axios';

export default async function fetchMembers(
	props: MemberRequest
): Promise<RawMember[] | undefined> {
	const url: string = `https://api.oireachtas.ie/v1/constituencies?chamber_id=&chamber=${
		props.chamber // Chamber ID
	}&house_no=${props.house_no}&limit=${props.limit ?? 80}`;

	// Fetch data from the constituencies API using the constructed URL
}
