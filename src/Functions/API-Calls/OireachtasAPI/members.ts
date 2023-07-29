/** @format */

import { Chamber, DateRange } from '@/Models/_utility';
import fetcher from '..';
import {
	MemberRequest,
	RawFormattedMember,
	RawMember,
	RawOuterMember,
} from '@/Models/OireachtasAPI/member';
import { removeOuterObjects } from '@/Functions/Util/objects';
import validateOireachtasRequest from './_validateRequest';

export default async function fetchMembers(
	props: MemberRequest
): Promise<RawFormattedMember[] | RawMember[]> {
	props = validateOireachtasRequest(props);

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

	let members = (await fetcher(url)).results;
	if (props.formatted === false) {
		return members.map((member: RawOuterMember) => {
			return member.member;
		});
	}
	const formattedMembers = members.map((member: RawMember) => {
		const m = removeOuterObjects(member);
		const uri = m.memberCode;
		const name = m.fullName;
		const firstName = m.firstName;
		const lastName = m.lastName;
		const dateRange = m.memberships.dateRange;
		const house = m.memberships.house;
		const offices = m.memberships.offices;
		const constituencies = m.memberships.represents;
		const parties = m.memberships.parties;
		return {
			uri,
			name,
			firstName,
			lastName,
			dateRange,
			house,
			offices,
			constituencies,
			parties,
		};
	});

	// Basic Formatting
	return formattedMembers;
}
