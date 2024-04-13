/** @format */
// Importing necessary modules
import {
	PartyRequest,
	PartyResult,
	PartyAPI,
} from '@/models/oireachtas_api/party';
import axios from 'axios';

export default async function fetchParties(
	props: PartyRequest
): Promise<PartyAPI[] | undefined> {
	// Constructing the API request URL with the given parameters
	const url = `https://api.oireachtas.ie/v1/parties?chamber_id=${
		props.chamber ? `&chamber=${props.chamber}` : ''
	}${props.house_no ? `&house_no=${props.house_no.toString()}` : ''}&limit=${
		props.limit ? props.limit : '150'
	}`;

	try {
		const response = await axios.get(url);
		return response.data.results.house.parties.map((p: PartyResult) => {
			return { name: p.party.showAs, uri: p.party.partyCode };
		});
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}
