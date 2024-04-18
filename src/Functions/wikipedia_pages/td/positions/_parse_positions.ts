/** @format */

import cheerio from 'cheerio';
import * as Cheerio from 'cheerio';
import { WikiPosition, WikiURIpair } from '@/models/member/wiki_profile';
import parseWikiPositionType from './parse_type';
import { formatDateRange, formatName, logObjIssues } from './format_utils';
import { extractNumberFromString } from '../../../_utils/strings';

// Parses position from wiki info box
export function parseWikiPositions(el: Cheerio.Cheerio<Cheerio.Element>) {
	const wikiPositions: WikiPosition[] = [];

	// Iterate over <th> elements to get each position
	el.find('.infobox-header').each((index, element) => {
		const title = cheerio(element);
		if (title.text() === 'Personal details') {
			// Do nothing for 'Personal details'
			return;
		} else if (title.text() !== 'Military service') {
			const parsed = parsePositionDetails(title);
			wikiPositions.push(...parsed);
		}
	});

	const otherPositions = wikiPositions.filter((p) => p.type === 'other');
	if (otherPositions.length > 0) console.info(otherPositions);

	return wikiPositions;
}

function parsePositionDetails(title: Cheerio.Cheerio<Cheerio.Element>) {
	let el = title.parent().next();

	// get name and href / wikiURI
	let name = title.text();
	const href = title.find('a').attr('href');

	// var to handle logic
	let isIncumbent = false;

	const wikiPositions: WikiPosition[] = [];

	let tempStart: string | undefined = undefined;
	let tempEnd: string | undefined = undefined;
	let predecessor: WikiURIpair | undefined = undefined;
	let exceptionTrigger = true; // count for exception trigger
	// add items to array and parse and format them, and log issues
	function addWikiPosition(
		name: string,
		href: string | undefined,
		tempStart: string,
		tempEnd: string | undefined,
		predecessor: WikiURIpair | undefined,
		successor: WikiURIpair | undefined
	) {
		const obj = {
			title: { name: name, wikiURI: href },
			type: parseWikiPositionType(name, href),
			dateRange: formatDateRange(tempStart!, tempEnd),
			...(predecessor! && { predecessor: predecessor }),
			...(successor! && { successor: successor }),
		};
		if (!wikiPositions.some((wp) => wp === obj)) wikiPositions.push(obj);

		logObjIssues('main add function', obj);
	}

	// iterate over trs
	while (el.length) {
		// If is another position, break the loop
		if (el.hasClass('infobox-header') || el.find('.infobox-header').length)
			break;

		const text = el.text();

		// Get period / date range
		if (text.includes('Incumbent')) isIncumbent = true;
		else if (
			text.includes('Assumed office') ||
			text.includes('In office') ||
			text.includes('Acting')
		) {
			const dr = parseDateRange(text);
			tempStart = dr.tempStart;
			tempEnd = dr.tempEnd;
		}
		// Get predecessors and successors in position
		else if (text.includes('Preceded by')) {
			predecessor = parsePositionSibling(el);
			if (isIncumbent!) {
				addWikiPosition(
					name,
					href,
					tempStart!,
					tempEnd,
					predecessor,
					undefined
				);

				isIncumbent = false;
			}
		} else if (!isIncumbent && text.includes('Succeeded by')) {
			const successor = parsePositionSibling(el);
			addWikiPosition(name, href, tempStart!, tempEnd, predecessor, successor);
		}
		// Parses td position / period
		else if (text.includes('Constituency')) {
			const wikiURI = el.find('td').find('a').attr('href');
			const constitName = name.includes(' for ')
				? name
				: `${name} for ${el.find('td').text()}`;
			addWikiPosition(
				constitName,
				wikiURI,
				tempStart!,
				tempEnd,
				undefined,
				undefined
			);
		}

		// Checks for Exceptional logic
		else if (!isIncumbent) {
			const thEl = el.find('th').text().trim();
			let split: (string | undefined)[] = thEl.split('–');
			const isException =
				(split.length === 2 &&
					split[0]?.trim().length === 4 &&
					split[1]?.trim().length === 4) ||
				(thEl.length === 4 && parseInt(thEl)) ||
				(thEl.length === 5 && thEl.endsWith('–'));

			if (isException!) {
				if (exceptionTrigger!) el = el.prev(); // Triggers once
				if (thEl.length === 4) {
					const year = extractNumberFromString(thEl).toString();
					split[0] = year;
					split[1] = year;
				} else if (thEl.length === 5) {
					// if is period just yyyy or yyyy-
					split[0] = extractNumberFromString(thEl).toString();
					split[1] = undefined;
				}

				const obj = handleDatelessExceptions(split, name, el);

				if (obj!) {
					wikiPositions.push(obj);
					exceptionTrigger = false;
				}
			}
		}
		el = el.next();
	}
	return wikiPositions;
}

// Handle exceptions where it is formatted <th>yyyy - yyyy<th> <td>position<td>
function handleDatelessExceptions(
	split: (string | undefined)[],
	name: string,
	el: Cheerio.Cheerio<Cheerio.Element>
) {
	if (name.includes('Minister of State') || name.includes('Chief Whip')) {
		// get wiki uri
		const wikiURI = el.find('a').attr('href');

		// get name / title
		let newName =
			el.find('a').attr('title') ??
			wikiURI?.replace('/wiki/', '').replaceAll('_', ' ');
		if (!newName) newName = 'Minister of State';
		if (el.text().includes('Chief Whip'))
			if (el.text().includes('Government')) newName = 'Government Chief Whip';
			else if (el.text().includes('Opposition'))
				newName = 'Opposition Chief Whip';

		const obj = {
			title: { name: newName, wikiURI },
			type: parseWikiPositionType(newName),
			dateRange: formatDateRange(split[0]!, split[1]),
		};

		if (obj.dateRange === undefined) console.info(obj);
		const issues = logObjIssues('handleDatelessExceptions', obj);

		return obj;
	} else {
		console.info(name, el.text(), el.next().text());
		return undefined;
	}
}

function parseDateRange(text: string) {
	let tempStart,
		tempEnd = undefined;
	if (text.includes('Assumed office'))
		tempStart = text.replace('Assumed office', '').trim();
	else if (text.includes('In office') || text.includes('Acting'))
		[tempStart, tempEnd] = text
			.replace('In office', '')
			.replace('Acting', '')
			.split('–')!;
	return { tempStart: tempStart as string, tempEnd };
}

// Parses successors / predecessors in position
function parsePositionSibling(el: Cheerio.Cheerio<Cheerio.Element>) {
	const foundEl = el.find('td');
	const sibName = formatName(foundEl.text());
	const wikiURI = foundEl.find('a').attr('href');
	return {
		name: sibName,
		wikiURI:
			sibName.includes('New office') ||
			sibName.includes('Office established') ||
			sibName.includes('Vacant')
				? undefined
				: wikiURI,
	};
}
