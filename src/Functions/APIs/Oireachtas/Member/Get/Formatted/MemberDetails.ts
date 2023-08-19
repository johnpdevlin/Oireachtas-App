/** @format */
import parseMemberships from '../../ParseMemberships';
import fetchMembers from '../Raw/get';
import { MemberURI } from '@/Models/_util';
import { MemberAPIdetails } from '@/Models/OireachtasAPI/Formatted/Member/member';

export default async function getMemberAPIdetails(
	uri: MemberURI
): Promise<MemberAPIdetails | void> {
	try {
		const response = await fetchMembers({ uri });
		const member = response![0];

		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath = member.dateOfDeath ? member.dateOfDeath : undefined;
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
