/** @format */

import fetcher from '..';
import { voteRequest } from '../../Models/apiRequests';
import { format } from 'date-fns';
import { Vote } from '../../Models/UI/participation';
import formatVotes from './Formatter/Memberships/votes';

export default async function fetchVotes(
	props: voteRequest
): Promise<Vote[] | any[]> {
	// convers date type to string
	if (props.date instanceof Date) {
		props.date = format(props.date, 'yyyy-MM-dd');
	}
	if (props.dateEnd instanceof Date) {
		props.dateEnd = format(props.dateEnd, 'yyyy-MM-dd');
	}

	// url to execute API request
	const url = `https://api.oireachtas.ie/v1/divisions?${
		props.chamberType ? `chamber_type=${props.chamberType}` : ''
	}&chamber_id=&date_start=${props.date ? props.date : '1900-01-01'}&date_end=${
		props.dateEnd ? props.dateEnd : props.date ? props.date : '2099-01-01'
	}&limit=${props.limit ? props.limit : 10000}
	${props.debateId ? `&debate_id=${props.debateId}` : ''}
	${props.voteId ? `&vote_id=${props.voteId}` : ''}${
		props.member
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member}`
			: ''
	}
	&outcome=${props.outcome ? `${props.outcome}` : ''}`;

	const member = props.member;

	const votes = await fetcher(url); // requests json response

	if (props.formatted == false) {
		return votes.results;
	}

	// formats votes
	const formattedVotes = await formatVotes(votes.results, member!);

	// Sorts votes by time
	const sortedVotes = formattedVotes.sort(function (a, b) {
		return a.timeStamp.getTime() - b.timeStamp.getTime(); // sorts by time
	});

	return sortedVotes;
}
