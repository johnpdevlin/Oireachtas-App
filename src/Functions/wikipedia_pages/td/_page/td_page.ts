/** @format */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { WikiMemberProfileDetails } from '@/models/member/wiki_profile';
import { parseWikiPositions } from '../positions/_parse_positions';
import parsePersonalDetails from '../personal_details/_parse_personal_details';

// Scrapes the Wikipedia profile of TD with retry logic
export default async function scrapeTDWikiPage(
	wikiURI: string
): Promise<WikiMemberProfileDetails> {
	let retryCount = 0;
	let wikiProfileDetails: WikiMemberProfileDetails | undefined = undefined;

	const MAX_RETRY_ATTEMPTS = 5;
	const BASE_TIMEOUT_MS = 1000; // Initial timeout in milliseconds

	while (retryCount < MAX_RETRY_ATTEMPTS) {
		try {
			const url = `https://en.wikipedia.org${wikiURI}`;
			let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
			const $ = cheerio.load(response);

			const infobox = $('.infobox tbody').first();

			// Extract positions (party, constit, gov etc.)
			const positions = parseWikiPositions(infobox);

			// Extract personal details (birthdate, education, etc.)
			const personalDetails = parsePersonalDetails(infobox);

			// Extract the birth information
			const wikiName = $('h1').text();

			// Construct and return the WikiProfileDetails object
			wikiProfileDetails = {
				wikiName,
				wikiURI,
				...personalDetails,
				positions,
			};

			// Break out of the loop if the operation is successful
			break;
		} catch (error) {
			retryCount++;
			console.error(
				`Error scraping Wikipedia page for URI ${wikiURI}. Retrying... (${retryCount}/${MAX_RETRY_ATTEMPTS} attempts)`
			);

			if (retryCount < MAX_RETRY_ATTEMPTS) {
				const timeoutMs = BASE_TIMEOUT_MS * Math.pow(2, retryCount);
				console.log(`Waiting ${timeoutMs / 1000} seconds before retrying... `);
				await new Promise((resolve) => setTimeout(resolve, timeoutMs));
			}
		}
	}

	if (!wikiProfileDetails) {
		console.error(
			`Failed to scrape Wikipedia page for URI ${wikiURI} after ${MAX_RETRY_ATTEMPTS} attempts`
		);
		throw new Error('Error scraping wiki page');
	}

	return wikiProfileDetails;
}
