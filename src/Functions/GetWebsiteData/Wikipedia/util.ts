/** @format */
import * as cheerio from 'cheerio';
import { ElectionData, DailElectionData } from './scrapePartyPage';

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

export function parseTableToObjects(
	tableHtml: string
): TableRow[] | ElectionData[] | unknown[] {
	let isElectionTable = false;
	let tableRows: TableRow[] = [];

	const $ = cheerio.load(tableHtml);
	const table = $('table');

	// Find the header row (th elements)
	const headerRow = table.find('tr').first();
	const headerCells = headerRow.find('th');

	// Get the number of columns in the table
	const numColumns = headerCells.length;

	// Get the keys from the header row and convert them to lowercase
	const keys: string[] = [];
	headerCells.each((index, cell) => {
		let key = $(cell).text().toLowerCase().trim();
		if (key === '%') {
			key = 'percentage';
			isElectionTable = true;
		} else if (key === ('+/–' || '±')) {
			key = 'change';
			isElectionTable = true;
		} else if (key.includes('pref') || key.includes('preference votes')) {
			key = 'firstPrefs';
			isElectionTable = true;
		}
		if (key !== '+/–') keys.push(key);
	});

	// Find the data rows (excluding the header row)
	const dataRows = table.find('tr').slice(1);

	// Iterate over each data row
	dataRows.each((index, row) => {
		const rowData: TableRow = {};

		// Find all cells in the row (including td and th elements)
		const cells = $(row).find('th, td');

		let cellIndex = 0;
		let colSpanOffset = 0;

		// Iterate over each cell and assign the value to the corresponding key
		cells.each((_, cell) => {
			const colSpan = parseInt($(cell).attr('colspan') || '1', 10);
			const rowSpan = parseInt($(cell).attr('rowspan') || '1', 10);

			// Handle cells spanning multiple rows/columns
			for (let i = 0; i < colSpan; i++) {
				const key = keys[cellIndex + colSpanOffset];

				let value: string | number = $(cell).text().trim();
				if (key === 'firstPrefs') {
					value = parseInt(value.replace(',', ''));
				}

				if (rowData[key]) {
					rowData[key] += ' ' + value; // Concatenate values for cells spanning multiple rows/columns
				} else {
					rowData[key] = value;
				}

				// Increment the cell index based on the column span
				if (i < colSpan - 1) {
					colSpanOffset++;
				}
			}

			// Increment the cell index based on the row span
			if (rowSpan > 1) {
				cellIndex += numColumns;
			} else {
				cellIndex++;
				colSpanOffset = 0;
			}
		});

		tableRows.push(rowData);
	});

	if (isElectionTable!) {
		return formatTableArrayToElection(tableRows);
	}

	return tableRows;
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
		let [p, r] = (rowData.percentage as string).split('(');
		const percentage = parseFloat(p.trim());
		const rank = parseInt(
			r?.replace(')', '').replace('#', '').trim() as string
		);

		// Parse seats (total, outOf, change)
		let total = 0;
		let outOf = 0;

		let [s, e] = (rowData.seats as string).split('/');
		total = parseInt(s.trim());
		outOf = parseInt(e.trim());

		// Parse Changes
		const change = total - previousSeats;
		previousSeats = total;

		const electionDatum: ElectionData = {
			election: election,
			percentage: percentage,
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
