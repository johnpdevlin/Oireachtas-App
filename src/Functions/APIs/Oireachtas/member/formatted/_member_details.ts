/** @format */

import parseMemberships from './parse_memberships/_index';
import fetchMembers from '../raw/_member_details';
import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';

const MAX_RETRY_ATTEMPTS = 5;
const BASE_TIMEOUT_MS = 1000; // Initial timeout in milliseconds

// Aggregates All Member details with retry logic
async function getMemberAPIdetails(
	uri: string
): Promise<MemberAPIdetails | undefined> {
	let retryCount = 0;
	let memberDetails: MemberAPIdetails | undefined = undefined;

	while (retryCount < MAX_RETRY_ATTEMPTS) {
		try {
			const response = await fetchMembers({ uri });
			const member = response![0];

			const fullName = member.fullName;
			const firstName = member.firstName;
			const lastName = member.lastName;
			const dateOfDeath = member.dateOfDeath;
			const memberships = parseMemberships(member.memberships);

			memberDetails = {
				uri,
				fullName,
				firstName,
				lastName,
				dateOfDeath,
				...memberships,
			};

			// Break out of the loop if the operation is successful
			break;
		} catch (err) {
			retryCount++;
			console.error(
				`Error fetching member details for URI ${uri}.\n Retry attempt ${retryCount}... Retrying...`
			);

			if (retryCount < MAX_RETRY_ATTEMPTS) {
				const timeoutMs = BASE_TIMEOUT_MS * Math.pow(2, retryCount);
				console.log(`Waiting ${timeoutMs / 1000} seconds before retrying...`);
				await new Promise((resolve) => setTimeout(resolve, timeoutMs));
			}
		}
	}

	if (!memberDetails) {
		console.error(
			`Failed to fetch member details for URI ${uri} after ${MAX_RETRY_ATTEMPTS} attempts`
		);
	}

	return memberDetails;
}

export default getMemberAPIdetails;
