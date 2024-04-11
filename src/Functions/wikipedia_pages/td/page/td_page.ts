/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
	getInfoBoxHref,
	getInfoBoxText,
	removeSquareFootnotes,
} from '../../_utils/_utils';
import {
	getTextAfterLastComma,
	getTextAfterLastParentheses,
} from '@/functions/_utils/strings';
import { extractDateFromYMDstring } from '@/functions/_utils/dates';
import { OirDate } from '@/models/dates';
import { WikiTDProfileDetails } from '@/models/wiki_td';
import extractEducation from './extract_education';

// Scrapes the Wikipedia profile of TD
export default async function scrapeTDWikiPage(
	wikiURI: string
): Promise<WikiTDProfileDetails> {
	const url = `https://en.wikipedia.org${wikiURI}`;

	try {
		let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		const $ = cheerio.load(response);

		// Extract the birth information
		const wikiName = $('h1').text();
		const bornThElement = $('th:contains("Born")').next().text();
		const birthDate = extractDateFromYMDstring(bornThElement as OirDate);
		const birthPlace = removeSquareFootnotes(
			getTextAfterLastParentheses(bornThElement)! // extracts the birthplace from the string
		);
		const birthCountry = birthPlace
			? getTextAfterLastComma(birthPlace)
			: undefined;

		// Extract the education, alma mater, and website information from the info box
		const education = extractEducation($, 'Education') ?? [];
		const almaMater = extractEducation($, 'Alma mater') ?? [];
		const websiteUrl = getInfoBoxHref($, 'Website');

		// Extracts the number of children from the info box
		const numOfChildren = (): number | undefined => {
			const num = getInfoBoxText($, 'Children');
			if (!num) return undefined;
			else return parseInt(num) ?? 0;
		};

		const marriageDetails = (): string | undefined => {
			let spouse = getInfoBoxText($, 'Spouse');
			if (!spouse) spouse = getInfoBoxText($, 'Spouse(s)');
			if (!spouse?.startsWith('.')) return spouse;
		};

		// Construct and return the WikiProfileDetails object
		const wikiProfileDetails: WikiTDProfileDetails = {
			wikiName,
			wikiURI,
			birthDate,
			birthPlace,
			birthCountry,
			education,
			almaMater,
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
