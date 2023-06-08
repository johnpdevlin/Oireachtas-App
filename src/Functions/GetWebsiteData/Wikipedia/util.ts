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
		list.push(item);
	});

	return list;
}

type TableRow = {
	[key: string]: string | number;
};

//
///////////////

export function parseHTMLtable(html: string) {
	const $ = cheerio.load(html);
	const table = $('table.wikitable');
	const rows = table.find('tr');

	// Parse header row to get keys
	const headerRow = $(rows[0]);
	const keys: string[] = [];
	headerRow.find('th').each((index, element) => {
		const key = $(element).text().trim();
		keys.push(key);
	});

	const data: Record<string, string>[] = [];

	let found = false; // Move the found variable outside the loop
	let targets: { key: string; value: string }[] = [];
	rows.slice(1).each((rowIndex, row) => {
		const rowCells = $(row).find('td');
		const rowData: Record<string, string> = {};

		if (rowCells.length < keys.length) {
			const previousRow = $(rows[rowIndex - 1]).find('td');

			const filteredKeys = keys.filter((key) =>
				targets.find((target) => target.key !== key)
			);

			rowCells.each((cellIndex, cell) => {
				const key = filteredKeys[cellIndex];
				const value = $(cell).text().trim();
				rowData[key] = value;
			});

			targets.forEach((tk) => {
				rowData[tk.key] = tk.value;
			});
		} else {
			rowCells.each((cellIndex, cell) => {
				const key = keys[cellIndex];
				const rowSpan = $(cell).attr('rowspan');
				const value = $(cell).text().trim();
				rowData[key] = value;
				if (rowSpan) {
					let foundTarget = targets.find((target) => target.key === key);
					if (!foundTarget) {
						targets.push({ key: key, value: value });
					}
				}
			});
		}

		data.push(rowData);
	});

	return data;
}

export function formatTableArrayToElection(
	tableRows: TableRow[]
): ElectionData[] {
	// Convert ordinary parsed table rows into ElectionData objects

	// existing table rows change value does not specify negative number
	// sort so change +/- can be inferred from order /
	const rows = sortElectionByEarliestYear(tableRows as unknown[]);
	let previousSeats = 0;

	const electionData: ElectionData[] = tableRows.map((rowData: TableRow) => {
		const election: number = parseInt(rowData.election as string);

		// Parse percentage and rank
		let p, r, rank, percentage;
		if (rowData.percentage) {
			if ((rowData.percentage as string)?.includes('#')) {
				[p, r] = (rowData.percentage as string).split('(');
				rank = parseInt(r?.replace(')', '').replace('#', '').trim() as string);
			}
			percentage = extractNumberFromString(rowData.percentage as string);
		}
		// Parse seats (total, outOf, change)
		let total = 0;
		let outOf = 0;
		if (rowData.seats) {
			let [s, e] = (rowData.seats as string).split('/');
			total = parseInt(s.trim());
			outOf = parseInt(e.trim());
		}
		// Parse Changes
		const change = total - previousSeats;
		previousSeats = total;

		const electionDatum: ElectionData = {
			election: election,
			...(rowData.country && { country: rowData.country as string }),
			...(percentage && { percentage: percentage }),

			firstPrefs: parseInt(rowData.firstPrefs as string),
			seats: {
				total: total,
				outOf: outOf,
				change: change,
			},
			...(isNaN(rank) ? {} : { rank: rank }),
		};

		return electionDatum;
	});

	return electionData;
}

export function sortElectionByEarliestYear(
	data: DailElectionData[] | ElectionData[] | unknown[]
): DailElectionData[] | ElectionData[] | unknown[] {
	data.sort((a, b) => {
		const valueA = typeof a.election === 'number' ? a.election : Infinity;
		const valueB = typeof b.election === 'number' ? b.election : Infinity;

		return valueA - valueB;
	});
	return data;
}
