/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
	getInfoBoxHref,
	getInfoBoxText,
	getInfoBoxTitle,
	removeFootnote,
} from './util';
import {
	getTextAfterLastComma,
	startsWithNumber,
} from '@/Functions/Util/strings';

type WikiProfileDetails = {
	birthdate: Date | undefined;
	birthplace: string | undefined;
	birthCountry: string | undefined;
	education: string | undefined;
	educationWikiID: string | undefined;
	almaMater: string | undefined;
	almaMaterWikiID: string | undefined;
	marriageDetails: string | undefined;
	numOfChildren: number | undefined;
	websiteUrl: string | undefined;
};

// Removes text between parentheses in a string.
function removeTextBetweenParentheses(input: string): string | undefined {
	// Find the index of the first "("
	const firstOpenParenIndex = input.indexOf('(');

	// Find the index of the last ")"
	const lastCloseParenIndex = input.lastIndexOf(')');

	// Check if both parentheses are found in the string
	if (firstOpenParenIndex !== -1 && lastCloseParenIndex !== -1) {
		// Extract the portion of the string after the last closing parenthesis
		return input.slice(lastCloseParenIndex + 1).trim();
	}

	// Return undefined if parentheses are not found
	return undefined;
}

// Extracts a date string in "YYYY-MM-DD" format from the input string and returns it as a Date object.
function extractDateFromString(input: string): Date | undefined {
	const regex = /\d{4}-\d{2}-\d{2}/; // Regex pattern for "YYYY-MM-DD" format
	const match = input.match(regex); // Find the date string in the input

	if (match) {
		const date = new Date(match[0]); // Convert the matched string to a Date object
		return date;
	}

	// Return undefined if no date string was found
	return undefined;
}

// Scrapes the Wikipedia profile of Niamh Smyth.
export default async function scrapeWikiTDprofile(): Promise<WikiProfileDetails> {
	const url = `https://en.wikipedia.org/wiki/Niamh_Smyth`;

	try {
		let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		const $ = cheerio.load(response);

		// Extract the birth information
		const bornThElement = $('th:contains("Born")').next().text();
		const birthdate = extractDateFromString(bornThElement);
		const birthplace = removeFootnote(
			removeTextBetweenParentheses(bornThElement)!
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
