/** @format */

import fetcher from '..';
import { DebateRequest } from '@/Models/OireachtasAPI/debate';

export default async function fetchDebates(props: DebateRequest) {
	// converts date type to string
	const url: string = `https://api.oireachtas.ie/v1/debates?${
		props.chamber_type ? `chamber_type=${props.chamber_type}` : ''
	}${props.chamber_id ? `&chamber=${props.chamber_id}` : ''}
	&date_start=${props.date_start ? props.date_start : '1900-01-01'}&date_end=${
		props.date_end ? props.date_end : '2099-01-01'
	}
	&limit=${props.limit ? props.limit : 5000}
	${
		props.member
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member}`
			: ''
	}${props.debate_id ? `&debate_id=${props.debate_id}` : ''}
	`;
	const debates = await fetcher(url);

	return debates.results;
}
