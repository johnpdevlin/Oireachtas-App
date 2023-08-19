/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
	getInfoBoxHref,
	getInfoBoxText,
	getInfoBoxTitle,
	removeSquareFootnotes,
} from '../../_util/_util';
import {
	getTextAfterLastComma,
	getTextAfterLastParentheses,
	startsWithNumber,
} from '@/Functions/_util/strings';
import { extractDateFromYMDstring } from '@/Functions/_util/dates';
import { OirDate } from '@/Models/dates';
import { WikiProfileDetails } from '@/Models/Scraped/Wiki/member';

// Scrapes the Wikipedia profile of Niamh Smyth.
export default async function scrapeTDWikiPage(
	wikiURI: string
): Promise<WikiProfileDetails> {
	const url = `https://en.wikipedia.org${wikiURI}`;

	try {
		let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		const $ = cheerio.load(response);

		// Extract the birth information
		const bornThElement = $('th:contains("Born")').next().text();
		const birthdate = extractDateFromYMDstring(bornThElement as OirDate);
		const birthplace = removeSquareFootnotes(
			getTextAfterLastParentheses(bornThElement)! // extracts the birthplace from the string
		);
		const birthCountry = birthplace
			? getTextAfterLastComma(birthplace)
			: undefined;

		// Extract the education, alma mater, and website information from the info box
		const education = getInfoBoxText($, 'Education');
		const educationWikiID = getInfoBoxHref($, 'Education');
		const almaMater = getInfoBoxTitle($, 'Alma mater');
		const almaMaterWikiID = getInfoBoxHref($, 'Alma mater');
		const websiteUrl = getInfoBoxHref($, 'Website');

		// Extracts the number of children from the info box
		const numOfChildren = (): number | undefined => {
			const num = getInfoBoxText($, 'Children');
			if (num === undefined) return undefined;
			return startsWithNumber(num) ? parseInt(num!) : 0;
		};

		const marriageDetails = (): string | undefined => {
			let spouse = getInfoBoxText($, 'Spouse');
			if (!spouse) {
				spouse = getInfoBoxText($, 'Spouse(s)');
			}
			return spouse;
		};

		// Construct and return the WikiProfileDetails object
		const wikiProfileDetails: WikiProfileDetails = {
			wikiURI,
			birthdate,
			birthplace,
			birthCountry,
			education,
			educationWikiID,
			almaMater,
			almaMaterWikiID,
			marriageDetails: marriageDetails(),
			numOfChildren: numOfChildren(),
			websiteUrl,
		};

		return wikiProfileDetails;
	} catch (error) {
		console.log(error);
		throw new Error('Error scraping wiki page');
	}
}
