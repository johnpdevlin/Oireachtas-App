/** @format */
import * as cheerio from 'cheerio';
import { DailElectionData, ElectionData, Seats } from '../../party/party_page';
import {
	concatenateItems,
	splitByLowerUpperCase,
	validateStandardFullName,
} from '@/functions/_utils/strings';
import { removeSquareFootnotes } from '@/Functions/_util/_util';
import { extractNumberFromString } from '../../../_utils/strings';

export function parseDailElectionTable(html: string): DailElectionData[] {
	// HMTL Table structure is awkward to parse
	// So awkward and specific ways of parsing are required
	if (!html) return [];
	const $ = cheerio.load(html);

	let dailElectionData: DailElectionData[] = [];
	let currentLeader: string = '';
	let numOfGovs: number = 1; // number of governments per election cycle
	let targetElectionIndex: string = '';

	const table = $('table.wikitable tbody tr:gt(0)');

	const isSF = () => {
		return $(table).find('td:contains("Ruairí Ó Brádaigh")').length > 0;
	};
	// Set numOfGovs and targetElectionIndex before iterating over the table rows
	table.each((index, element) => {
		const $row = $(element);

		if (numOfGovs > 1) {
			// Where multiple govs per election cycle
			// Logic to correct for multiple cells per row on html table row

			// parse government info (i.e. government, opposition, etc.)
			const government = $row.find('td').text();

			const targetIndex = dailElectionData.findIndex(
				// Finds index so gov details can be added to it
				(data) => data.election.toString() === targetElectionIndex
			);

			const existingGovernment = dailElectionData[targetIndex].government;
			if (typeof existingGovernment === 'string') {
				// Convert the existing government string to an array
				dailElectionData[targetIndex].government = [
					existingGovernment,
					government,
				];
			} else if (Array.isArray(existingGovernment)) {
				// Add the new government string to the existing array
				dailElectionData[targetIndex].government.push(government);
			}

			numOfGovs--; // decrement so logic follows correct path
		} else {
			// Parse election cycle info

			// parse election year (+ month if available)
			const election = removeSquareFootnotes(
				$row.find('th:nth-child(1) a').text().trim()
			);
			if (
				isSF() === true &&
				election &&
				extractNumberFromString(election) < 1970
			) {
				// Current SF didn't exist before 1970
				return;
			} else {
				// Leaders can span multiple election cycles
				// On table reflected as one cell across multiple rows
				// This logic is necessary to ensure the correct leader is assigned to the correct election cycle
				const leader = $row.find('td:nth-child(2)').text().trim();

				// where multiple leaders, splits string into array
				if (validateStandardFullName(leader) === true) {
					currentLeader = leader;
				}
				let temp: string[] | string = splitByLowerUpperCase(leader);
				if (temp.length > 1) {
					// formats array into single line

					if (temp.every((t) => validateStandardFullName(t)) === true) {
						currentLeader = concatenateItems(temp);
					}
				}

				// parse first preference votes
				const firstPrefs = parseInt(
					$row.find('td:contains(",")').text().trim().replace(',', '')
				);

				// parse percentage and ranking
				let [percentageTemp, rankingTemp]: string[] = $row
					.find('td:contains("#")')
					.text()
					.split('(');
				if (!rankingTemp && !percentageTemp) return;
				const percentage = parseFloat(percentageTemp.trim());
				const rank = parseInt(rankingTemp.replace('#', '').replace(')', ''));

				// parse seats
				let [t, o] = $row.find('td:contains(" / ")').text().split('/');
				const total = parseInt(t.trim());
				const outOf = parseInt(o.trim());

				const chgElement = $row.find('th:contains("±")');
				const chg =
					chgElement.length > 0
						? chgElement.next().text().trim()
						: $row.find('th:contains("+/–")').next().text().trim();
				const change = !isNaN(chg) ? parseInt(chg) : 0;

				const seats: Seats = { total, outOf, change };

				// parse government info (i.e. government, opposition, etc.)
				const classesToFind = ['table-yes2', 'table-no2', 'table-partial'];

				let government: string | string[];
				for (const c of classesToFind) {
					const temp = $row.find(`td[class*=${c}]`).text().trim();
					if (temp) {
						government = temp;
						break; // If a match is found, exit the loop
					}
				}

				// find rowspan to see if multiple govs in election cycle
				// set numOfGovs and targetElectionIndex accordingly
				const rowSpan = $row.find('th').attr('rowspan');
				if (rowSpan) {
					numOfGovs = parseInt(rowSpan);
					targetElectionIndex = election.toString();
				}
				if (election! !== '') {
					const electionDatum: DailElectionData = {
						election,
						leader: currentLeader,
						firstPrefs,
						percentage,
						rank,
						seats,
						government: government!,
					};

					dailElectionData.push(electionDatum);
				}
			}
		}
	});

	let previousSeats = 0;
	const output = dailElectionData.map((data) => {
		// Parse Changes
		const change = data.seats.total - previousSeats;
		previousSeats = data.seats.total;

		return {
			...data,
			seats: {
				total: data.seats.total,
				outOf: data.seats.outOf,
				change: change,
			},
		};
	});

	return output;
}

type TableRow = {
	[key: string]: string | number;
}; ///////////////

export function parseHTMLtable(
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

	return tableRows;
}

export function parseSFhtmlTable(html: string) {
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

	let targets: { key: string; value: string }[] = [];

	// Loop through each row
	rows.slice(1).each((rowIndex, row) => {
		const rowCells = $(row).find('td');

		const rowData: Record<string, string> = {};

		// If the number of cells is less than the number of keys, merge with previous row
		if (rowCells.length < keys.length) {
			const previousRow = $(rows[rowIndex - 1]).find('td');

			// Filter out keys that have already been merged and assign values to remaining keys
			const filteredKeys = keys.filter((key) =>
				targets.find((target) => target.key !== key)
			);

			rowCells.each((cellIndex, cell) => {
				const key = filteredKeys[cellIndex];
				const value = $(cell).text().trim();
				rowData[key] = value;
			});

			// Assign targets to remaining keys
			targets.forEach((tk) => {
				rowData[tk.key] = tk.value;
			});
		} else {
			// If the number of cells equals the number of keys, assign values to each key
			rowCells.each((cellIndex, cell) => {
				const key = keys[cellIndex];
				const rowSpan = $(cell).attr('rowspan');
				const value = $(cell).text().trim();
				rowData[key] = value;

				// If the cell has a rowspan, assign target for merging with next row
				if (rowSpan) {
					let foundTarget = targets.find((target) => target.key === key);
					if (!foundTarget) {
						targets.push({ key: key, value: value });
					}
				}
			});
		}

		// Add parsed row data to array
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

	const keyMapping: { [key: string]: string } = {
		'+/-': 'change',
		'±': 'change',
		'%': 'percentage',
		'Vote %': 'percentage',
		'1st Pref Votes': 'firstPrefs',
		'1st pref votes': 'firstPrefs',
		'1st pref Votes': 'firstPrefs',
		'First preference votes': 'firstPrefs',
		'First preference vote': 'firstPrefs',
	};
	const rows = tableRows.map((row) => {
		const updatedObj: { [key: string]: any } = {};
		for (const key in row) {
			if (key in keyMapping) {
				const newKey = keyMapping[key];
				updatedObj[newKey] = row[key];
			} else {
				updatedObj[key] = row[key];
			}
			updatedObj[key.toLowerCase()] = row[key];
		}
		return updatedObj;
	});

	let previousSeats = 0;

	const electionData: ElectionData[] = rows.map((rowData: TableRow) => {
		const election: number = parseInt(rowData.election as string);

		// Parse first prefs
		const firstPrefs = rowData.firstPrefs;

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

			...(firstPrefs && { firstPrefs: firstPrefs }),
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
