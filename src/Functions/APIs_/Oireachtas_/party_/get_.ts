/** @format */
// Importing necessary modules
import {
	PartyRequest,
	PartyResult,
	PartyAPI,
} from '@/models/oireachtasApi/party';
import axios from 'axios';

export default async function fetchParties(
	props: PartyRequest
): Promise<PartyAPI[] | undefined> {
	// Constructing the API request URL with the given parameters
	const url = `https://api.oireachtas.ie/v1/parties?chamber_id=${
		props.chamber_id ? `&chamber=${props.chamber_id}` : ''
	}${props.house_no ? `&house_no=${props.house_no.toString()}` : ''}&limit=${
		props.limit ? props.limit : '150'
	}`;

	try {
		const response = await axios.get(url);
		return response.data.results.house.parties.map((p: PartyResult) => p.party);
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}