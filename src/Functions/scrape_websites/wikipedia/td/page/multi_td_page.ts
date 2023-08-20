/** @format */

import scrapeDailSessionPage from '@/functions/scrape_websites/wikipedia/dail/dail_session';
import scrapeTDWikiPage from '@/functions/scrape_websites/wikipedia/td/page/td_page';
import { WikiProfileDetails } from '@/models/scraped/wiki/member';
import { URIpair } from '@/models/_utils';

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