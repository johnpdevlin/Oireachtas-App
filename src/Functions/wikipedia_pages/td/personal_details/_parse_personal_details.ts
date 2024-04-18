/** @format */

import cheerio from 'cheerio';
import * as Cheerio from 'cheerio';
import { WikiBirthDetails, parseBirthDetails } from './birth_details';
import { parseEducationDetails } from './education';

export default function parsePersonalDetails(
	el: Cheerio.Cheerio<Cheerio.Element>
) {
	const startPoint = el
		.find('.infobox-header:contains("Personal details")')
		.parent()
		.next();

	const parsed: Record<string, unknown> = {};

	el.find('th').each((index, element) => {
		const labelEl = cheerio(element);
		const label = labelEl.text();
		const value = parseRowDetails(labelEl);
		if (label === 'Born') {
			Object.keys(value as WikiBirthDetails).forEach((key) => {
				if (value[key] !== undefined) parsed[key] = value[key];
			});
		} else if (value!) parsed[label.toLowerCase()] = value;
	});

	return parsed;
}

function parseRowDetails(labelEl: Cheerio.Cheerio<Cheerio.Element>) {
	const label = labelEl.text();
	const valueEl = labelEl.parent().find('td');
	const value = valueEl.text();

	if (label === 'Born') {
		return parseBirthDetails(value);
	} else if (label === 'Education') {
		return parseEducationDetails(valueEl);
	} else if (label === 'Alma mater') {
		return parseEducationDetails(valueEl);
	} else if (label === 'Children') {
		return parseInt(value) ?? undefined;
	} else if (label === 'Website') {
		return valueEl.find('a').attr('href');
	}

	return;
}

// function parseList(el: Cheerio.Cheerio<Cheerio.Element>) {
// 	const items: { name: string; wikiURI: string | undefined }[] = [];
// 	el.find('li').each((index, e) => {
// 		const li = cheerio(e);
// 		items.push({ name: li.text(), wikiURI: li.find('a').attr('href') });
// 	});
// 	return items;
// }
