/** @format */
import parseMemberships from './parse_memberships/_index';
import fetchMembers from '../raw/_member_details';
import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';

// Aggregates All Member details
async function getMemberAPIdetails(
	uri: string
): Promise<MemberAPIdetails | undefined> {
	try {
		const response = await fetchMembers({ uri });
		const member = response![0];

		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath = member.dateOfDeath;
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
