/** @format */

/** @format */
import { Committee } from '@/Models/committee';
import { scrapeCommitteePageInfo } from '@/Functions/GetWebsiteData/Oireachtas/Committee/WebPage/pageInfo';
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from '@/Functions/GetWebsiteData/Oireachtas/Committee/WebPage/baseDetails';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { RawMember } from '@/Models/OireachtasAPI/member';

export async function processAllCommitteeInfo(): Promise<Committee[]> {
	console.log('Scraping data for all committees has begun.');
	// Get all committee base details
	const allCommitteesBaseDetails = await scrapeCommitteesBaseDetails();

	// Passed in to avoid refetching for each committee
	const rawMembers = (await fetchMembers({ formatted: false })) as RawMember[];

	// Get details for members of committee and other details
	const committees = await (
		await allCommitteesBaseDetails.reduce(
			async (resultsPromise: Promise<Committee[]>, c: BaseCommittee) => {
				const results = await resultsPromise;
				const info = await scrapeCommitteePageInfo(c.dailNo, c.uri, rawMembers);
				if (info?.name) {
					results.push(info);
				} else {
					console.error('Issue with committee scraping:', c.uri);
				}
				return results;
			},
			Promise.resolve([])
		)
	).filter(Boolean);

	console.log('Committee scraping process complete.');
	return committees;
}
