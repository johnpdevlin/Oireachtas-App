/** @format */

import { addOrdinalSuffix } from '@/Functions/Util/strings';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getInfoBoxTitle, removeSquareFootnotes } from './util';

type PartyInfo = {
	name: string;
	uri: string;
	isGovernment: boolean;
};

export type WikiDailDetails = {
	[x: string]: any;
	ceannComhairle: string;
	leasCeannComhairle: string;
	taoiseach: string;
	tánaiste: string;
	chiefWhip: string;
	leaderOfOpposition: string;
	tdWikiUris: { uri?: string; name: string }[];
	parties: PartyInfo[];
};

function parsePartyInfo($: cheerio.CheerioAPI): PartyInfo[] {
	// Find all tables on the page
	const tables = $('table.wikitable');

	// Find the first relevant table and ignore any further tables
	const table = $(tables[0]);

	// Find all rows in the table except the header row
	const rows = table.find('tr:not(:first-child)');

	const parties: PartyInfo[] = [];

	// Iterate over each row
	rows.each((index, row) => {
		const tds = $(row).find('td');

		// Check if the first column contains a government indicator
		const isGovernment: boolean = $(tds[0]).find('span').length > 0;

		// Extract party name and href from the second column
		const partyCell = $(tds[1]);
		const partyName = partyCell.find('a').text();
		const partyHref = partyCell.find('a').attr('href')!;

		// Create party object and add it to the parties array
		const party = {
			name: partyName,
			uri: partyHref,
			isGovernment: isGovernment,
		};
		parties.push(party);
	});

	return parties.filter((party) => party.name !== '');
}

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
				const name = removeSquareFootnotes(anchor.attr('title')!);
				return { uri, name };
			})
			.filter((element) => element.uri && element.name) // Filter out undefined
			.filter((entry, index, self) => {
				// Filter out duplicate entries based on href and title
				const lookupKey = entry.uri! + entry.name!;
				return index === self.findIndex((e) => e.uri! + e.name! === lookupKey);
			});

		// Get party details
		const partyDetails: PartyInfo[] = parsePartyInfo($);

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
			tdWikiUris: tdWikiUris!,
			parties: partyDetails,
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error scraping wiki page');
	}
}
