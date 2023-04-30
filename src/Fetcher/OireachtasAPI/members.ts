/** @format */

import MemberRequest from '@/Models/OireachtasAPI/Request/memberRequest';
import fetcher from '..';
import { MemberResult } from '@/Models/OireachtasAPI/Response/memberResponse';

export default async function fetchMembers(
	props: MemberRequest
): Promise<MemberResult[]> {
	let url: string;

	if (props.uri!) {
		url = `https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.uri}`;
	} else {
		url = `https://api.oireachtas.ie/v1/members?${
			props.date_start ? `date_start=${props.date_start}` : ''
		}&chamber_id=${props.chamber_id ? `&chamber=${props.chamber_id}` : ''}${
			props.house_no ? `&house_no=${props.house_no}` : ''
		}&date_end=${props.date_end ? props.date_end : '2099-01-01'}${
			props.const_code ? `&const_code=${props.const_code}` : ''
		}${props.party_code ? `&party_code=${props.party_code}` : ''}&limit=${
			props.limit ? props.limit : 2500
		}`;
	}

	let members: MemberResult[] = (await fetcher(url)).results;

	return members;
}
