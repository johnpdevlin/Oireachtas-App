/** @format */

/** @format */
import { Committee } from '@/Models/committee';
import { scrapeCommitteePageInfo } from '@/Functions/GetWebsiteData/Oireachtas/Committee/WebPage/pageInfo';
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from '@/Functions/GetWebsiteData/Oireachtas/Committee/WebPage/baseDetails';

export async function processAllCommitteeInfo(): Promise<Committee[]> {
	// Get all committee base details
	const allCommitteesBaseDetails = await scrapeCommitteesBaseDetails();

	// Get details for members of committee and other details
	const committees = await allCommitteesBaseDetails.reduce(
		async (resultsPromise: Promise<Committee[]>, c: BaseCommittee) => {
			const results = await resultsPromise;
			const info = await scrapeCommitteePageInfo(c.dailNo, c.uri);
			if (info?.name) {
				results.push(info);
			} else {
				console.error('Issue with committee scraping:', c.uri);
			}
			return results;
		},
		Promise.resolve([])
	);
	return committees;
}
