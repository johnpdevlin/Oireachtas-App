/** @format */
// Importing necessary modules
import { PartyRequest } from '@/Models/OireachtasAPI/party';
import fetcher from '..';

export default async function fetchParties(props: PartyRequest): Promise<{}[]> {
	// Constructing the API request URL with the given parameters
	const url = `https://api.oireachtas.ie/v1/parties?chamber_id=${
		props.chamber_id ? `&chamber=${props.chamber_id}` : ''
	}${props.house_no ? `&house_no=${props.house_no.toString()}` : ''}&limit=${
		props.limit ? props.limit : '150'
	}`;

	// Fetching the parties data from the Oireachtas API with the constructed URL
	const partiesResponse = await fetcher(url);

	// Destructuring parties data from the API response
	const parties = partiesResponse.results.house.parties.map((p) => p.party);

	// If the `houseDetails` property in the request parameters is truthy, return the parties data as-is

	// Otherwise, return the `parties` property within the `house` property of the parties data
	return parties;
}
