/** @format */

import fetcher from '..';
import {
	CommitteeDebateRecord,
	DebateRecord,
	DebateRequest,
} from '@/Models/OireachtasAPI/debate';
import validateOireachtasRequest from './_validateRequest';
import { removeOuterObjects } from '../../Util/objects';

export default async function fetchDebates(
	props: DebateRequest,
	formatter?: (dbRecords: DebateRecord[]) => CommitteeDebateRecord[]
): Promise<DebateRecord[] | CommitteeDebateRecord[]> {
	props = validateOireachtasRequest(props);

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
	const debates = (await fetcher(url)).results;

	// Remove outer objects
	const output: DebateRecord[] = (await debates).map(
		(debate: { [x: string]: any }) => {
			return removeOuterObjects(debate.debateRecord);
		}
	);

	if (formatter) {
		return formatter(output);
	}

	return output;
}
