/** @format */

import { format } from 'date-fns';
import fetcher from '..';
import { debateRequest } from '@/Types/Oireachtas/Debates';

export default async function fetchDebates(props: debateRequest) {
	// converts date type to string
	if (props.date instanceof Date) {
		props.date = format(props.date, 'yyyy-MM-dd');
	}
	if (props.dateEnd instanceof Date) {
		props.dateEnd = format(props.dateEnd, 'yyyy-MM-dd');
	}

	const url: string = `https://api.oireachtas.ie/v1/debates?date_start=${
		props.date ? props.date : '1900-01-01'
	}&date_end=${
		props.dateEnd ? props.dateEnd : props.date ? props.date : '2099-01-01'
	}${
		props.chamberType
			? `&chamber_Type=${props.chamberType}&${
					props.chamber ? `&chamber=${props.chamber}&` : ''
			  }`
			: ''
	}&limit=${props.limit ? props.limit : 5000}${
		props.member
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member}`
			: ''
	}`;

	const debates = await fetcher(url);

	return debates.results;
}
