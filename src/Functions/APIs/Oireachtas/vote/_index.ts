/** @format */
import { VoteRequest, RawVote } from '@/models/oireachtasApi/vote';
import axios from 'axios';

export default async function fetchVotes(
	props: VoteRequest
): Promise<RawVote[]> {
	// url to execute API request
	const url = `https://api.oireachtas.ie/v1/divisions?${
		props.chamber_type ? `chamber_type=${props.chamber_type}` : ''
	}&chamber_id=
	&chamber=${props.chamber ? props.chamber : ''}&date_start=${
		props.date_start ? props.date_start : '1900-01-01'
	}&date_end=${props.date_end ? props.date_end : '2099-01-01'}&limit=${
		props.limit ? props.limit : 10000
	}
	${props.debate_id ? `&debate_id=${props.debate_id}` : ''}
	${props.vote_id ? `&vote_id=${props.vote_id}` : ''}${
		props.member_id
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member_id}`
			: ''
	}
	&outcome=${props.outcome ? `${props.outcome}` : ''}`;

	try {
		const response = await axios.get(url);
		return response.data.results.map((v: { division: {} }) => {
			return v.division;
		});
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
		return [];
	}
}
