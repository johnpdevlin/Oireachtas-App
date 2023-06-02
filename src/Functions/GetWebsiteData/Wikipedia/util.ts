/** @format */
import * as cheerio from 'cheerio';

// Retrieves the details from the info box table using the target string
export function getInfoBoxTitle(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	return $(`th:contains("${target}")`).next().find('a').attr('title');
}

export function getInfoBoxText(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	return $(`th:contains("${target}")`).next().text().trim();
}

export function getInfoBoxHref(
	$: cheerio.CheerioAPI,
	target: string
): string | undefined {
	return $(`th:contains("${target}")`).next().find('a').attr('href');
}

export function removeFootnote(input: string): string {
	const regex = /\[[\dA-Za-z]\]/g;
	if (input === undefined) return '';
	else if (input.match(regex)) return input.replace(regex, '');
	else return input;
}
