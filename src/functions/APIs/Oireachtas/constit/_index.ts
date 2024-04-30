/** @format */
import {
	ConstituencyOrPanel,
	ConstituencyRequest,
} from '@/models/oireachtas_api/constituency';
import { ConstituencyAPI } from '@/models/oireachtas_api/constituency';
import axios from 'axios';

export default async function fetchConstituencies(
	props: ConstituencyRequest // Props object with request parameters
): Promise<ConstituencyAPI[] | undefined> {
	// Construct the URL for the constituencies API with the request parameters
	const url: string = `https://api.oireachtas.ie/v1/constituencies?chamber_id=&chamber=${
		props.chamber // Chamber ID
	}&house_no=${props.house_no}&limit=${props.limit ?? 80}`;

	try {
		const response = await axios.get(url);
		return response.data.results.house.constituenciesOrPanels.map(
			(con: { constituencyOrPanel: ConstituencyOrPanel }) => {
				const c = con.constituencyOrPanel;
				return {
					type: c.representType,
					name: c.showAs,
					uri: c.representCode,
				} as ConstituencyAPI;
			}
		);
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}
