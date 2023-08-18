/** @format */

import scrapeDailSessionPage from '@/Functions/GetWebsiteData/Wikipedia/scrapeDailSessionPage';
import scrapeTDWikiPage from '@/Functions/GetWebsiteData/Wikipedia/scrapeTDpage';
import { removeTextBetweenParentheses } from '../../../../Util/strings';
import scrapeAllWikiConstituencies from '@/Functions/GetWebsiteData/Wikipedia/scapeAllConstituencies';
import scrapeWikiPartyPage from '@/Functions/GetWebsiteData/Wikipedia/scrapePartyPage';
export default async function processTDwikiData(dailSession: number) {
	const dail = await scrapeDailSessionPage(dailSession);
	const tdData = Promise.all(
		dail.tdWikiUris.map(async (td) => {
			return {
				name: removeTextBetweenParentheses(td.name),
				...(await scrapeTDWikiPage(td.uri!)),
			};
		})
	);

	// const partyData = dail.parties.map(async (party) => {
	// 	return {
	// 		name: party.name,
	// 		wikiURI: party.uri,
	// 		isGovernment: party.isGovernment,
	// 		...(await scrapeWikiPartyPage(party.uri)),
	// 	};
	// });
	// const constitData = await scrapeAllWikiConstituencies();
	return tdData;
	console.log(partyData);

	// const data = { ...dail, tdData: Promise.all(tdData) };
	// console.log(data);
}
