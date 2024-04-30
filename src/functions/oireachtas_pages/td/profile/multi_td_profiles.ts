/** @format */

import { MemberRequest, RawMember } from '@/models/oireachtas_api/member';
import fetchMembers from '../../../APIs/Oireachtas/member/raw/_member_details';
import scrapeMemberOirProfile from './td_profile';
import { retryScrapingWithBackoff } from '@/functions/_utils/web_scrape';

export default async function getMultiMembersOirDetails(
	uris?: string[],
	request?: MemberRequest
) {
	try {
		if (!uris && request)
			uris = (await fetchMembers(request))?.map(
				(member: RawMember) => member.uri
			);

		if (!uris || uris.length === 0) {
			console.error('No URIs provided.');
			return;
		}

		const failedURIs: string[] = [];
		const results = await retryScrapingWithBackoff(
			uris,
			failedURIs,
			scrapeMemberOirProfile
		);

		return results;
	} catch (error) {
		console.error('An error occurred:', error);
		return;
	}
}
