/** @format */

import {
	capitaliseFirstLetters,
	removeTextAfterParenthesis,
} from '@/Functions/Util/strings';
import axios from 'axios';
import he from 'he';

export default async function parseCommitteeReport(
	url: string
): Promise<{ present: string[]; alsoPresent: string[] }> {
	try {
		if (url !== undefined) {
			const response = await axios.get(`api/pdf2text?url=${url}`);
			const text = he.decode(response.data.text);
			const lines = text?.split('\n');

			let searching = false;
			let present: string[] = [];
			let alsoPresent: string[] = [];

			for (let i = 0; i < lines.length; i++) {
				let line = lines[i].toLowerCase();

				// Check if the line indicates the start of attendee information
				if (line.includes('present')) {
					searching = true;
				}

				if (searching) {
					// Skip lines that are not useful based on certain conditions
					const shouldSkipLine =
						line.includes('present') ||
						line.includes('deputies') ||
						line.includes('senators') ||
						line.includes('1') ||
						line.includes('clerk') ||
						line === '' ||
						line.includes(')');
					if (!shouldSkipLine) {
						if (line) {
							if (line.includes(',*') || line.includes('.*')) {
								// Clause to find attendees who were there in absence of a member
								const count = line.split('*');
								let alsos = line.split(',');
								if (count.length > 2) {
									const additionalNames = formatPresentString(line);
									alsoPresent.push(...additionalNames);
									line = '';
								} else if (count.length === 2) {
									if (line.endsWith('*')) {
										const additionalName = formatPresentString(alsos[1]);
										alsoPresent.push(...additionalName);
										line = alsos[0];
									} else {
										const additionalName = formatPresentString(alsos[0]);
										alsoPresent.push(...additionalName);
										line = alsos[1];
									}
								}
							}
							if (line.includes('in attendance')) {
								// If the line includes 'in attendance', extract additional attendees' names
								const additionalNames = formatPresentString(line);
								if (additionalNames.length === 0) console.error(lines);
								alsoPresent.push(...additionalNames);
							} else if (line.includes('in the absence of')) {
								const potentialName = format(
									line.split('in the absence of')[0]
								);
								alsoPresent.push(potentialName);
							} else {
								// Format the names of the present attendees
								if (line.length > 0) {
									const processedNames = formatPresentString(line);
									if (processedNames !== undefined) {
										present.push(...processedNames);
									}
								}
							}
						}
					}
					// Check if the line indicates the end of attendee information
					if (line.includes('in the chair')) {
						searching = false;
						break;
					}
				}
			}

			// Remove any undefined values from the arrays
			present = present.filter(Boolean);
			alsoPresent = alsoPresent.filter(Boolean);

			// Return the attendees' lists
			return { present, alsoPresent };
		}
	} catch (error) {
		console.log(url, error);
	}

	// Return [] if an error occurred or if the URL is undefined
	return { present: [], alsoPresent: [] };
}

function format(pr: string): string {
	// remove unneccessary characters
	if (pr == undefined || pr.length === 0) {
		return '';
	}
	pr = pr.toLowerCase().trim();

	if (pr.includes('’')) pr.replace('’', "'"); // To normalise some Irish names

	if (pr.includes('/')) pr = pr.replaceAll('/', '');
	if (pr.includes('+')) pr = pr.replaceAll('+', '');
	if (pr.includes('*')) pr = pr.replaceAll('*', '');
	if (pr.includes(':')) pr = pr.replaceAll(':', '');
	if (pr.includes('(')) pr = removeTextAfterParenthesis(pr);
	if (pr.endsWith('.')) pr = pr.slice(0, -1);
	if (pr.endsWith(',')) pr = pr.slice(0, -1);

	if (pr.includes('deputies')) pr = pr.replace('deputies', '');
	if (pr.includes('deputy')) pr = pr.replaceAll('deputy', '');
	if (pr.includes('senators')) pr = pr.replace('senators', '');
	if (pr.includes('senator')) pr = pr.replaceAll('senator', '');
	if (pr.includes('ministers')) pr = pr.replace('ministers', '');
	if (pr.includes('minister')) pr = pr.replaceAll('minister', '');
	if (pr.includes('taoiseach')) pr = pr.replace('taoiseach', '');
	if (pr.includes('tánaiste')) pr = pr.replace('tánaiste', '');
	if (pr.includes('ceann comhairle')) pr = pr.replace('ceann comhairle', '');
	if (pr.includes('teachtaí')) pr = pr.replace('teachtaí', '');
	if (pr.includes('dála')) pr = pr.replace('dála', '');
	if (pr.includes('teachta')) pr = pr.replaceAll('teachta', '');
	if (pr.includes('dáil')) pr = pr.replaceAll('dáil', '');
	if (pr.includes('seanadóirí')) pr = pr.replace('seanadóirí', '');
	if (pr.includes('seanadóir')) pr = pr.replaceAll('seanadóir', '');
	if (pr.includes('cathaoirleach')) pr = pr.replace('cathaoirleach', '');

	if (pr.includes('i láthair')) pr = pr.replace('i láthair', '');
	if (pr.includes('in the chair')) pr = pr.replace('in the chair', '');
	if (pr.includes('sa chathaoir')) pr = pr.replace('sa chathaoir', '');
	if (pr.includes('comhaltaí a bhí')) pr = pr.replace('comhaltaí a bhí', '');

	if (pr.length === 0) {
		return '';
	}

	pr = capitaliseFirstLetters(pr.trim());
	return pr;
}
function formatPresentString(presence: string): string[] {
	// Check if presence indicates "in attendance"
	if (presence.includes('in attendance')) {
		let present: string = presence;
		if (presence.includes(':')) present = presence.split(':')[1].trim(); // Extract the name after the colon
		return [format(present)]; // Format the name and return it as a single-element array
	}

	if (presence.split('.').length > 1) {
		const present: string[] = presence
			.split('.')
			.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
			.filter(Boolean); // Filter out any empty or undefined names
		return present; // Return the array of formatted names
	}

	// Check if presence contains commas (multiple names separated by commas)
	if (presence.includes(',')) {
		const present: string[] = presence
			.split(',')
			.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
			.filter(Boolean); // Filter out any empty or undefined names
		return present; // Return the array of formatted names
	}

	// Check if presence contains "and" (multiple names separated by "and")
	if (presence.includes('and')) {
		const present: string[] = presence
			.split(' and ')
			.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
			.filter(Boolean); // Filter out any empty or undefined names
		return present; // Return the array of formatted names
	}

	// Check that name not in format of John J. Joe
	if (
		presence.includes('.') &&
		presence.charAt(presence.indexOf('.') - 1) !== ' '
	) {
		const present: string[] = presence
			.split('.')
			.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
			.filter(Boolean); // Filter out any empty or undefined names
		return present; // Return the array of formatted names
	}

	// If none of the above conditions match, treat the presence as a single name
	return [format(presence)]; // Format the name and return it as a single-element array
}
