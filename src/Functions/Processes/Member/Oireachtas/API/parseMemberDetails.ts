/** @format */

import checkGender from '@/Functions/API-Calls/IrishNamesAPI';
import fetcher from '@/Functions/API-Calls/fetcher';
import parseMemberships from './Parse/Memberships';

export default function parseMemberDetails(
	uri: string,
	boyNames?: Record<number, string>,
	girlNames?: Record<number, string>
) {
	const m = fetcher(
		`https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${uri}`
	).then(async (response) => {
		const member = response.results[0].member;
		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath = member.dateOfDeath;
		// May want to add logic to pass boy and girl names in so to avoid refetching
		const gender = await checkGender(firstName, boyNames, girlNames);
		const uri = member.memberCode;

		const memberships = parseMemberships(member.memberships);
		console.log(gender);
	});
}
