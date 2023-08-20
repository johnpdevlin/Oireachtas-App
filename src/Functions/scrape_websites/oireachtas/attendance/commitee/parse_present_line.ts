/** @format */

import {
	capitaliseFirstLetters,
	removeTextAfterOpeningParenthesis,
	removeTextBeforeClosingParenthesis,
	removeTextBetweenParentheses,
} from '@/functions/_utils/strings';
import { RawFormattedMember } from '@/models/oireachtasApi/member';

export function parsePresentLine(
	presence: string,
	members?: RawFormattedMember[]
): string[] | undefined {
	// Check for direct matches
	if (presence! && presence !== '') {
		if (members) {
			presence.includes('’') && presence.replace('’', "'").toLowerCase();
			const matchedMembers = members
				?.filter((mem) => presence.includes(mem.name.toLowerCase()))
				.map((mem) => mem.name.toLowerCase());
			if (matchedMembers && matchedMembers.length > 0) {
				matchedMembers.forEach((mem) => presence.replace(mem, ''));
				const present = parsePresentLine(presence);
				if (present!) return [...present, ...matchedMembers];
			}
		}

		// Check if presence indicates "in attendance"
		if (presence.includes('in attendance')) {
			let present: string = presence;
			if (presence.includes(':')) present = presence.split(':')[1].trim(); // Extract the name after the colon
			return parsePresentLine(present, members); // formatPresentStr the name and return it as a single-element array
		}

		// Check if presence contains commas or and(multiple names separated by commas or and)
		if (
			(presence.includes(',') && !presence.endsWith(',')) ||
			presence.includes('and ')
		) {
			const present = presence
				.split(/(?:,|and )/) // Split by comma followed by space, and/or and followed by a space
				.map((name) => formatPresentStr(name.trim()))
				.filter((name) => name !== '')
				.filter(Boolean);

			present.forEach((p) => {
				if (p! && p.includes(',')) {
					console.log('Why does this presence string contain a comma?', p);
				}
			});

			if (present!) return present as string[]; // Return the array of formatted names
		}

		// Check that name not in formatPresentStr of John J. Joe
		if (
			presence.includes('.') &&
			presence.charAt(presence.indexOf('.') - 1) !== ' '
		) {
			const present = presence
				.split('.')
				.map((name) => formatPresentStr(name.trim())) // formatPresentStr each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);

			if (present!) return present as string[]; // Return the array of formatted names
		}

		if (presence.split('.').length > 1) {
			const present = presence
				.split('.')
				.map((name) => formatPresentStr(name.trim())) // formatPresentStr each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);
			if (present!) return present as string[]; // Return the array of formatted names
		}

		// If none of the above conditions match, treat the presence as a single name
		// formatPresentStr the name and return it as a single-element array
		const formattedString = formatPresentStr(presence);
		if (formattedString!) return [formattedString]; //
	} else {
		return undefined;
	}
}

export function formatPresentStr(pr: string): string | undefined {
	// remove unneccessary characters
	if (pr == undefined || pr.length < 5 || !pr.includes(' ')) {
		return undefined;
	}
	pr = pr.toLowerCase().trim();

	if (pr.includes('’')) pr.replace('’', "'");
	if (pr.includes('/')) pr = pr.replaceAll('/', '');
	if (pr.includes('+')) pr = pr.replaceAll('+', '');
	if (pr.includes('*')) pr = pr.replaceAll('*', '');
	if (pr.includes(':')) pr = pr.replaceAll(':', '');
	if (pr.endsWith('.')) pr = pr.slice(0, -1);
	if (pr.endsWith(',')) pr = pr.slice(0, -1);
	if (pr.includes('(')) {
		if (pr.includes(')')) pr = removeTextBetweenParentheses(pr);
		else pr = removeTextAfterOpeningParenthesis(pr);
	} else if (pr.includes(')')) pr = removeTextBeforeClosingParenthesis(pr);

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
	if (pr.includes('Le Haghaidh Cuid Den Choiste'))
		pr.replace('Le Haghaidh Cuid Den Choiste', '');
	if (pr.includes('In The Absence For Part Of The Meeting Of'))
		pr.replace('In The Absence For Part Of The Meeting Of', '');
	if (pr.includes('For Part Of The Meeting Of'))
		pr.replace('For Part Of The Meeting Of', '');
	if (pr.includes('in éagmais')) pr = pr.replace('in éagmais', '');
	if (pr.includes('in the chair')) pr = pr.replace('in the chair', '');
	if (pr.includes('sa chathaoir')) pr = pr.replace('sa chathaoir', '');
	if (pr.includes('comhaltaí a bhí')) pr = pr.replace('comhaltaí a bhí', '');

	if (pr.length < 5 && !pr.includes(' ')) {
		return undefined;
	}

	pr = capitaliseFirstLetters(pr.trim());
	return pr;
}
