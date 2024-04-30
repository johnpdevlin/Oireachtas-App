/** @format */

import scrapeDailSessionPage from '@/functions/wikipedia_pages/dail/dail_session';
import scrapeWikiPartyPage from './party_page';

export default async function scrapeDailSessionPartyPages(dail_no: number) {
	const dailSession = await scrapeDailSessionPage(dail_no);
	const partyPages = dailSession.parties.map((pp) =>
		scrapeWikiPartyPage(pp.uri)
	);
	console.info(partyPages);
	return partyPages;
}
