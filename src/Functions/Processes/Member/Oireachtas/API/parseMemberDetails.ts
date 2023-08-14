/** @format */

import checkGender from '@/Functions/API-Calls/IrishNamesAPI';
import fetcher from '@/Functions/API-Calls/fetcher';
import parseMemberships from './Parse/Memberships';
import { RawOuterMembership } from '@/Models/OireachtasAPI/member';

export default function parseMemberDetails(uri: string) {
	const m = fetcher(
		`https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${uri}`
	).then((response) => {
		const member = response.results[0].member;
		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath = member.dateOfDeath;
		const gender = findGender(member.gender, firstName);
		const uri = member.memberCode;
		// console.log(member);
		const memberships = (member.memberships as RawOuterMembership[]).map(
			(mem: RawOuterMembership) => parseMemberships(mem.membership)
		);
		// console.log(response.results);
	});
}

function findGender(gender: string, name: string) {
	if (gender === '') return gender;
	else checkGender(name);
}
