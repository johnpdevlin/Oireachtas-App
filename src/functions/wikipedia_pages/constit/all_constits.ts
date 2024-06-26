/** @format */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { getNextTableElAfterH2text } from '../_utils/utils';
import scrapeOneWikiConstituency from './constit';

interface RawWikiConstituency {
	name: string;
	wikiURI: string;
	seats: number;
}

// Scrapes the Wikipedia page for Dáil session details
export default async function scrapeAllWikiConstituencies(): Promise<
	RawWikiConstituency[]
> {
	// Set the URL of the page to be scraped
	const url = `https://en.wikipedia.org/wiki/Dáil_constituencies`;

	// Make the HTTP request to fetch the page HTML
	let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	const $ = cheerio.load(response);

	// Select table to be parsed
	const wikiUriElements = getNextTableElAfterH2text(
		$,
		'Current constituencies'
	);
	if (!wikiUriElements) return [];

	// Parse table rows to extract constituency data
	const wikiDetails: RawWikiConstituency[] = wikiUriElements
		.find('tr')
		.map((index, row) => {
			const el = $(row).find('td:first-child');
			const name = el.text().replace('\n', '');
			const href = el.find('a').attr('href')!;
			const seats = parseInt(el.next().text().replace('\n', ''));
			if (name === '') return;
			else return { name: name!, wikiURI: href!, seats: seats! };
		})
		.get();

	const wikiConstits = wikiDetails.map((co: RawWikiConstituency) => {
		const details = scrapeOneWikiConstituency(co.wikiURI);
		return { ...co, ...details };
	});

	return wikiConstits;
}
