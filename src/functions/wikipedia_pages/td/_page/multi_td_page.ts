/** @format */

import scrapeDailSessionPage from '@/functions/wikipedia_pages/dail/dail_session';
import scrapeTDWikiPage from '@/functions/wikipedia_pages/td/_page/td_page';
import { URIpair } from '@/models/_utils';
import { retryScrapingWithBackoff } from '@/functions/_utils/web_scrape';

export default async function getTDsWikiData(
	dailNo?: number,
	tdWikiURIs?: URIpair[]
) {
	try {
		console.info('Scraping and parsing data from Members` wikipedia pages...');
		if (dailNo! && !tdWikiURIs) {
			tdWikiURIs = (await scrapeDailSessionPage(dailNo!))
				.tdWikiUris as URIpair[];
		}

		const uris = tdWikiURIs?.map((t) => t.uri) as string[];
		const failedURIs: string[] = [];
		const results = await retryScrapingWithBackoff(
			uris,
			failedURIs,
			scrapeTDWikiPage
		);

		return results;
	} catch (error) {
		console.error('An error occurred:', error);
		return;
	}
}
