/** @format */

import {
	capitaliseFirstLetters,
	removeTextAfterParenthesis,
	removeTextBetweenParentheses,
} from '@/Functions/Util/strings';
import axios from 'axios';
function format(pr: string): string {
	// remove unneccessary characters
	pr = pr.toLowerCase();

	if (pr.includes('/')) pr = pr.replaceAll('/', '');
	if (pr.includes('+')) pr = pr.replaceAll('+', '');
	if (pr.includes('*')) pr = pr.replaceAll('*', '');
	if (pr.includes(':')) pr = pr.replaceAll(':', '');
	if (pr.includes('(')) pr = removeTextAfterParenthesis(pr);
	if (pr.endsWith('.')) pr = pr.slice(0, -1);
	if (pr.endsWith('.')) pr = pr.slice(0, -1);

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

	pr = capitaliseFirstLetters(pr).trim();
	return pr;
}
function formatPresentString(presence: string): string[] {
	// Check if presence indicates "in attendance"
	if (presence.includes('in attendance')) {
		const present: string = presence.split(':')[1].trim(); // Extract the name after the colon
		return [format(present)]; // Format the name and return it as a single-element array
	}

	// Check if presence contains commas (multiple names separated by commas)
	if (presence.includes(',')) {
		const present: string[] = presence
			.split(/,(?![^\(]*\))/)
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

export default async function parseCommitteeReport(
	url: string
): Promise<{ present: string[]; alsoPresent: string[] }> {
	try {
		if (url !== undefined) {
			const response = await axios.get(`api/pdf2text?url=${url}`);
			const text = response.data.text;
			const lines = text?.split('\n');

			let searching = false;
			let present: string[] = [];
			let alsoPresent: string[] = [];

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].toLowerCase();

				// Check if the line indicates the start of attendee information
				if (line.includes('present')) {
					searching = true;
				}

				// Check if the line indicates the end of attendee information
				if (line.includes('in the chair')) {
					searching = false;
					break;
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
						if (line.includes('in attendance')) {
							// If the line includes 'in attendance', extract additional attendees' names
							const additionalNames = formatPresentString(line.split(':')[1]);
							alsoPresent.push(...additionalNames);
						} else {
							// Format the names of the present attendees
							const processedNames = formatPresentString(line);
							if (processedNames !== undefined) {
								present.push(...processedNames);
							}
						}
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
