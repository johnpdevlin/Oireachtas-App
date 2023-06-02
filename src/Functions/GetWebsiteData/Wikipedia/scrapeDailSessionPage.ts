/** @format */

import { addOrdinalSuffix } from '@/Functions/Util/strings';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getInfoBoxTitle, removeFootnote } from './util';

type WikiDailDetails = {
	ceannComhairle: string;
	leasCeannComhairle: string;
	taoiseach: string;
	tánaiste: string;
	chiefWhip: string;
	leaderOfOpposition: string;
	tdWikiUris: { uri?: string; name: string }[];
};

// Retrieves the details from the info box table using the target string

// Scrapes the Wikipedia page for Dáil session details
export default async function scrapeWikiDailSession(
	dail_no: number
): Promise<WikiDailDetails> {
	const dail = addOrdinalSuffix(dail_no);
	const url = `https://en.wikipedia.org/wiki/Members_of_the_${dail}_Dáil`;

	try {
		// Make the HTTP request to fetch the page HTML
		let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		let $ = cheerio.load(response);

		// Get names of Ceann Comhairle, Leas-Cheann Comhairle, Taoiseach, Tánaiste, Chief Whip, Leader of the Opposition
		const ceannComhairle = getInfoBoxTitle($, 'Ceann Comhairle');
		const leasCeannComhairle = getInfoBoxTitle($, 'Leas-Cheann Comhairle');
		const taoiseach = getInfoBoxTitle($, 'Taoiseach');
		const tánaiste = getInfoBoxTitle($, 'Tánaiste');
		const chiefWhip = getInfoBoxTitle($, 'Chief Whip');
		const leaderOfOpposition = getInfoBoxTitle($, 'Leader of the Opposition');

		// Get URLs for TD wiki pages
		const wikiUriElements = $('td[data-sort-value]').toArray();
		const tdWikiUris = wikiUriElements
			.map((element) => {
				const anchor = $(element).find('a');
				const uri = anchor.attr('href');
				const name = removeFootnote(anchor.attr('title')!);
				return { uri, name };
			})
			.filter((element) => element.uri && element.name) // Filter out undefined
			.filter((entry, index, self) => {
				// Filter out duplicate entries based on href and title
				const lookupKey = entry.uri! + entry.name!;
				return index === self.findIndex((e) => e.uri! + e.name! === lookupKey);
			});

		// Throw an error if any of the required details are missing
		if (
			!ceannComhairle ||
			!leasCeannComhairle ||
			!taoiseach ||
			!tánaiste ||
			!chiefWhip ||
			!leaderOfOpposition ||
			!tdWikiUris
		) {
			throw new Error('Error scraping wiki page: missing required details');
		}

		// Return the scraped details
		return {
			ceannComhairle: ceannComhairle!,
			leasCeannComhairle: leasCeannComhairle!,
			taoiseach: taoiseach!,
			tánaiste: tánaiste!,
			chiefWhip: chiefWhip!,
			leaderOfOpposition: leaderOfOpposition!,
			wikiUris: tdWikiUris!,
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error scraping wiki page');
	}
}
