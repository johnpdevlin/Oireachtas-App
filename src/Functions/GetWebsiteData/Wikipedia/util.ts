/** @format */
import * as cheerio from 'cheerio';
import { ElectionData, DailElectionData } from './scrapePartyPage';
import { extractNumberFromString } from '@/Functions/Util/strings';

export function getInfoBoxTitle(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	// Retrieves the details from the info box table using the target string
	const element = $(`th:contains("${target}")`).next().find('a').first();
	return element.attr('title');
}

export function getInfoBoxText(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	// Retrieves the details from the info box table using the target string
	const element = $(`th:contains("${target}")`).next().first();
	return element.text().trim();
}

export function getInfoBoxHref(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	// Retrieves the details from the info box table using the target string
	const element = $(`th:contains("${target}")`).next().find('a').first();
	return element.attr('href');
}

export function removeSquareFootnotes(
	input: string | undefined
): string | undefined {
	const regex = /\[[\dA-Za-z]+\]/g;
	if (input === undefined) return undefined;
	else if (input.match(regex)) return input.replace(regex, '');
	else return input;
}

export function getNextTableElAfterH2text(
	$: cheerio.CheerioAPI,
	target: string
): cheerio.Cheerio<cheerio.Element> | undefined {
	const heading = $(`h2:contains("${target}")`);
	// Find the first table element that follows the heading
	const table = heading.nextAll('table').first();
	return table;
}

export function getNextTableElAfterH3text(
	$: cheerio.CheerioAPI,
	target: string
): cheerio.Cheerio<cheerio.Element> | undefined {
	const heading = $(`h3:contains("${target}")`);
	// Find the first table element that follows the heading
	const table = heading.nextAll('table').first();
	return table;
}

export function getNextTableElAfterH4text(
	$: cheerio.CheerioAPI,
	target: string
): cheerio.Cheerio<cheerio.Element> | undefined {
	const heading = $(`h4:contains("${target}")`);
	// Find the first table element that follows the heading
	const table = heading.nextAll('table').first();
	return table;
}
export function getListByTHtitle(
	$: cheerio.CheerioAPI,
	target: string
): string[] {
	let list: string[] = [];

	// Find the table row with {target} text in its <th> element
	const row = $(`tr:has(th:contains("${target}"))`);

	// Find the <ul> element within the <td> element following the <th> element
	const ul = row.find(`th:contains("${target}") + td ul`);

	// Iterate over each <li> element within the <ul> element
	ul.children().each((index, li) => {
		// Extract the text from the <a> element within the <li> element
		const item = removeSquareFootnotes($(li).find('a').text());

		// Add the item text to the list array
		if (item!) list.push(item);
	});

	return list;
}
