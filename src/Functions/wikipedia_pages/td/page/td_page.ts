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
import extractEducation from './extract_education';
import { WikiMemberProfileDetails } from '@/models/member/wiki_profile';
import { parseWikiPositions } from '../position/_parse_positions';

// Scrapes the Wikipedia profile of TD
export default async function scrapeTDWikiPage(
	wikiURI: string
): Promise<WikiMemberProfileDetails> {
	const url = `https://en.wikipedia.org${wikiURI}`;

	try {
		let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		const $ = cheerio.load(response);

		// Extract positions (party, constit, gov etc.)
		const infobox = $('.infobox tbody').first();
		const positions = parseWikiPositions(infobox);

		// Extract the birth information
		const wikiName = $('h1').text();
		const bornThElement = $('th:contains("Born")').next().text();
		let birthDate =
			(extractDateFromYMDstring(bornThElement as OirDate) as Date) ?? undefined;

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

		// const marriageDetails = (): string | undefined => {
		// 	let spouse = getInfoBoxText($, 'Spouse');
		// 	if (!spouse) spouse = getInfoBoxText($, 'Spouse(s)');
		// 	if (!spouse?.startsWith('.')) return spouse;
		// };

		// const domesticPartner = (): string | undefined => {
		// 	let partner = getInfoBoxText($, 'Partner');
		// 	if (!partner) partner = getInfoBoxText($, 'Domestic partner');
		// 	return partner;
		// };

		// Construct and return the WikiProfileDetails object
		const wikiProfileDetails: WikiMemberProfileDetails = {
			wikiName,
			wikiURI,
			birthDate,
			birthPlace,
			birthCountry,
			positions,
			education,
			almaMater,
			// marriageDetails: marriageDetails(),
			// domesticPartner: domesticPartner(),
			numOfChildren: numOfChildren(),
			websiteUrl,
		};

		return wikiProfileDetails;
	} catch (error) {
		console.log(error);
		throw new Error('Error scraping wiki page');
	}
}
