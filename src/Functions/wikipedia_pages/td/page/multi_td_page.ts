/** @format */

import scrapeDailSessionPage from '@/functions/wikipedia_pages/dail/dail_session';
import scrapeTDWikiPage from '@/functions/wikipedia_pages/td/page/td_page';

import { URIpair } from '@/models/_utils';
import { WikiMemberProfileDetails } from '../../../../models/member/wiki_profile';

export default async function getTDsWikiData(
	dailNo?: number,
	tdWikiURIs?: URIpair[]
) {
	console.info('Scraping and parsing data from Members` wikipedia pages...');
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

	return successes.map((result) => result.value) as WikiMemberProfileDetails[];
}
