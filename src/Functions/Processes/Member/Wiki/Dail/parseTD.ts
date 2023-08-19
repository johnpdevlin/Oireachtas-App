/** @format */

import scrapeDailSessionPage from '@/Functions/GetWebsiteData/Wikipedia/scrapeDailSessionPage';
import scrapeTDWikiPage from '@/Functions/GetWebsiteData/Wikipedia/scrapeTDpage';
import { URIpair } from '@/Models/_utility';

export default async function parseTDwikiData(
	dailNo?: number,
	tdWikiURIs?: URIpair[]
) {
	if (dailNo! && !tdWikiURIs) {
		tdWikiURIs = (await scrapeDailSessionPage(dailNo!)).tdWikiUris as URIpair[];
	}

	return tdWikiURIs!.map(async (td) => {
		return {
			...(await Promise.resolve(scrapeTDWikiPage(td.uri!))),
		};
	});
}
