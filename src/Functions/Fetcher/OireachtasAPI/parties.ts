/** @format */
// Importing necessary modules
import fetcher from '..';
import PartyRequest from '@/Models/OireachtasAPI/Request/partyRequest';
import {
	Party,
	PartiesDetailed,
	PartyApiResponse,
} from '@/Models/OireachtasAPI/Response/partyResponse';

/**
 * Fetches parties data from the Oireachtas API based on the given request parameters.
 * @param props The request parameters for the API call.
 * @returns A promise for the parties data returned by the API.
 */
export default async function fetchParties(
	props: PartyRequest
): Promise<PartiesDetailed | Party[]> {
	// Constructing the API request URL with the given parameters
	const url = `https://api.oireachtas.ie/v1/parties?chamber_id=${
		props.chamber_id ? `&chamber=${props.chamber_id}` : ''
	}${props.house_no ? `&house_no=${props.house_no.toString()}` : ''}&limit=${
		props.limit ? props.limit : '150'
	}`;

	// Fetching the parties data from the Oireachtas API with the constructed URL
	const partiesResponse: PartyApiResponse = await fetcher(url);

	// Destructuring parties data from the API response
	const parties: Party[] = partiesResponse.results.house.parties.map(
		(p) => p.party
	);

	// If the `houseDetails` property in the request parameters is truthy, return the parties data as-is
	if (props.house_details!) {
		const house = partiesResponse.results.house.house;
		return { house, parties };
	}

	// Otherwise, return the `parties` property within the `house` property of the parties data
	return parties;
}
