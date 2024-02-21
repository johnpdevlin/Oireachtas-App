/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { normalisePresentStr } from './normalise_present_str';

export function parsePresentLine(
	presence: string,
	members?: RawMember[]
): string[] | undefined {
	// Check for direct matches
	if (presence! && presence !== '') {
		if (members) {
			const extracted = extractAndFormatMembers(presence, members);
			if (extracted!) return extracted;
		}

		// Check if presence indicates "in attendance"
		if (presence.includes('in attendance')) {
			let present: string = presence;
			if (presence.includes(':')) present = presence.split(':')[1].trim(); // Extract the name after the colon
			return parsePresentLine(present, members); // normalisePresentStr the name and return it as a single-element array
		}

		// Check if presence contains commas or and(multiple names separated by commas or and)
		if (
			(presence.includes(',') && !presence.endsWith(',')) ||
			presence.includes('and ')
		) {
			const extracted = extractAndFormatMultipleMembers(presence);
			if (extracted!) return extracted;
		}

		// Check that name not in normalisePresentStr of John J. Joe
		if (
			presence.includes('.') &&
			presence.charAt(presence.indexOf('.') - 1) !== ' '
		) {
			const present = presence
				.split('.')
				.map((name) => normalisePresentStr(name.trim())) // normalisePresentStr each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);

			if (present!) return present as string[]; // Return the array of formatted names
		}

		if (presence.split('.').length > 1) {
			const present = presence
				.split('.')
				.map((name) => normalisePresentStr(name.trim())) // normalisePresentStr each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);
			if (present!) return present as string[]; // Return the array of formatted names
		}

		// If none of the above conditions match, treat the presence as a single name
		// normalisePresentStr the name and return it as a single-element array
		const formattedString = normalisePresentStr(presence);
		if (formattedString!) return [formattedString]; //
	} else {
		return undefined;
	}
}

function extractAndFormatMembers(presence: string, members: RawMember[]) {
	// Corrects incorrect name format for comparison
	presence.includes('’') && presence.replace('’', "'").toLowerCase();

	// Matches presence string to members
	const matchedMembers = members
		.filter((mem) => presence.includes(mem.fullName.toLowerCase()))
		.map((mem) => mem.fullName.toLowerCase());

	if (matchedMembers && matchedMembers.length > 0) {
		matchedMembers.forEach((mem) => presence.replace(mem, ''));
		const present = parsePresentLine(presence);
		if (present!) return [...present, ...matchedMembers];
	}
}

function extractAndFormatMultipleMembers(
	presence: string
): string[] | undefined {
	const present = presence
		.split(/(?:,|and )/) // Split by comma followed by space, and/or and followed by a space
		.map((name) => normalisePresentStr(name.trim()))
		.filter((name) => name !== '')
		.filter(Boolean);

	present.forEach((p) => {
		if (p! && p.includes(',')) {
			console.log('Why does this presence string contain a comma?', p);
		}
	});

	if (present!) return present as string[]; // Return the array of formatted names
}
