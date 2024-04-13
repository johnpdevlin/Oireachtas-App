/** @format */
import {
	MemberRequest,
	RawMember,
	RawOuterMember,
} from '@/models/oireachtas_api/member';
import axios from 'axios';

export default async function fetchMembers(
	props: MemberRequest
): Promise<RawMember[] | undefined> {
	let url: string;

	if (props.uri!) {
		url = `https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.uri}`;
	} else {
		url = `https://api.oireachtas.ie/v1/members?${
			props.date_start ? `date_start=${props.date_start}` : ''
		}&chamber_id=${props.chamber ? `&chamber=${props.chamber}` : ''}${
			props.house_no ? `&house_no=${props.house_no}` : ''
		}&date_end=${props.date_end ? props.date_end : '2099-01-01'}${
			props.const_code ? `&const_code=${props.const_code}` : ''
		}${props.party_code ? `&party_code=${props.party_code}` : ''}&limit=${
			props.limit ? props.limit : 2500
		}`;
	}

	try {
		const response = await axios.get(url);
		return response.data.results.map((member: RawOuterMember) => {
			const uri = member.member.memberCode;
			return { ...member.member, uri };
		});
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}
