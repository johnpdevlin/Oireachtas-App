/** @format */

import scrapeDailSessionPage from '@/Functions/ScrapeWebsites/Wikipedia/Dail/dailSession';
import scrapeTDWikiPage from '@/Functions/ScrapeWebsites/Wikipedia/TD/Page/TDpage';
import { WikiProfileDetails } from '@/Models/Scraped/Wiki/member';
import { URIpair } from '@/Models/_util';

export default async function getTDsWikiData(
	dailNo?: number,
	tdWikiURIs?: URIpair[]
) {
	if (dailNo! && !tdWikiURIs) {
		tdWikiURIs = (await scrapeDailSessionPage(dailNo!)).tdWikiUris as URIpair[];
	}

	const results = await Promise.allSettled(
		tdWikiURIs!.map(async (td) => {
			return {
				...(await scrapeTDWikiPage(td.uri!)),
			};
		})
	);

	const successes = results.filter((result) => result.status === 'fulfilled');
	const failures = results.filter((result) => result.status === 'rejected');

	if (failures.length > 0) {
		console.error(failures);
	}

	return successes.map((result) => result.value) as WikiProfileDetails[];
}
