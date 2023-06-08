/** @format */
import * as cheerio from 'cheerio';
import { DailElectionData, Seats } from './scrapePartyPage';
import {
	concatenateItems,
	splitByLowerUpperCase,
	validateStandardFullName,
	validateStandardName,
} from '@/Functions/Util/strings';
import { removeSquareFootnotes, sortElectionByEarliestYear } from './util';

export function parseDailElectionTable(html: string): DailElectionData[] {
	// HMTL Table structure is awkward to parse
	// So awkward and specific ways of parsing are required
	if (!html) return [];
	const $ = cheerio.load(html);

	let dailElectionData: DailElectionData[] = [];
	let currentLeader: string = '';
	let numOfGovs: number = 1; // number of governments per election cycle
	let targetElectionIndex: string = '';

	// Set numOfGovs and targetElectionIndex before iterating over the table rows
	$('table.wikitable tbody tr:gt(0)').each((index, element) => {
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
	});

	// console.log('dailElectionData', dailElectionData);
	// const data: DailElectionData[] = sortElectionByEarliestYear(dailElectionData);

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
