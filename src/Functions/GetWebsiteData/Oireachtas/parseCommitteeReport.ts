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
	if (presence !== undefined) {
		if (presence.includes('in attendance')) {
			let present: string = presence.split(':')[1];
			return [format(present)];
		} else if (presence.includes(',')) {
			let present: string[] = presence.split(/,(?![^\(]*\))/);

			present = present.map((pr) => {
				let name = format(pr);
				if (name !== '' && name !== undefined) {
					return name;
				}
			}) as string[];
			return present;
		} else if (presence.includes('and')) {
			let present: string[] = presence.split(' and ');
			present = present.map((pr) => {
				let name = format(pr);
				if (name !== '' && name !== undefined) {
					return name;
				}
			}) as string[];
		} else if (
			presence.includes('.') &&
			presence.charAt(presence.indexOf('.') - 2) !== ' '
		) {
			let present: string[] = presence.split('.');
			present = present.map((pr) => {
				let name = format(pr);
				if (name !== '' && name !== undefined) {
					return name;
				}
			}) as string[];
			return present;
		}
	} else {
		return [format(presence)];
	}
	return [];
}
export default async function parseCommitteeReport(
	url: string
): Promise<{ present: string[]; additionalAttendees: string[] } | void> {
	try {
		if (url !== undefined) {
			const response = await axios.get(`api/pdf2text?url=${url}`);
			const text = response.data.text;
			const lines = text?.split('\n');

			let searching = false;
			let present: string[] = [];
			let additionalAttendees: string[] = [];

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
							additionalAttendees.push(...additionalNames);
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
			additionalAttendees = additionalAttendees.filter(Boolean);

			// Return the attendees' lists
			return { present, additionalAttendees };
		}
	} catch (error) {
		console.log(url, error);
	}

	// Return undefined if an error occurred or if the URL is undefined
	return;
}
