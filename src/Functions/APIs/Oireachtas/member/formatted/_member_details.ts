/** @format */
import parseMemberships from './parse_memberships/_index';
import fetchMembers from '../raw/_member_details';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';

// Aggregates All Member details
async function getMemberAPIdetails(
	uri: string
): Promise<MemberAPIdetails | void> {
	try {
		const response = await fetchMembers({ uri });
		const member = response![0];

		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath =
			member.dateOfDeath !== ('' || undefined) ? member.dateOfDeath : null;
		const memberships = parseMemberships(member.memberships);

		return {
			uri,
			fullName,
			firstName,
			lastName,
			dateOfDeath,
			...memberships,
		};
	} catch (err) {
		console.log(err);
	}
}

export default getMemberAPIdetails;
