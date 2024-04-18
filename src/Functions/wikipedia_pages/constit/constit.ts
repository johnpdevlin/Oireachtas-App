/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getInfoBoxText } from '../_utils/utils';
import { splitByLowerUpperCase } from '@/functions/_utils/strings';

/**
 * Scrape information for a single constituency from its wikipedia page
 * @param wikiURI The URI of the constituency's wikipedia page
 * @returns An object containing various information about the constituency
 */
export default async function scrapeOneWikiConstituency(wikiURI: string) {
	// Set the URL of the wikipedia page to be scraped
	const url = `https://en.wikipedia.org${wikiURI}`;

	// Use custom API to make the HTTP request to fetch the page HTML and wait for response
	let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;

	// Load the HTML into cheerio for parsing
	const $ = cheerio.load(response);

	// Extract specific information from the wikipedia page's infobox using utility functions
	const created = parseInt(getInfoBoxText($, 'Created') as string);
	const createdFrom = splitByLowerUpperCase(
		getInfoBoxText($, 'Created from') as string
	);
	const euConstit = getInfoBoxText($, 'EP constituency');
	const localGovAreas = splitByLowerUpperCase(
		getInfoBoxText($, 'Local government areas') as string
	);

	// Return an object with the extracted information
	return {
		created,
		createdFrom,
		euConstit,
		localGovAreas,
	};
}
