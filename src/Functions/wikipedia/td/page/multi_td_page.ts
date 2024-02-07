/** @format */

import scrapeDailSessionPage from '@/functions/wikipedia/dail/dail_session';
import scrapeTDWikiPage from '@/functions/wikipedia/td/page/td_page';
import { WikiTDProfileDetails } from '@/models/scraped/wiki/td';
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

	return successes.map((result) => result.value) as WikiTDProfileDetails[];
}
