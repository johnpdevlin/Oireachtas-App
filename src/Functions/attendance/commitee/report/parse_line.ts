/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { formatPresentStr } from './format_present_str';
import { parsePresentLine } from './parse_present_line';

function parseLine(
	line: string,
	lines: string[],
	i: number,
	present: string[],
	alsoPresent: string[],
	allMembers: RawMember[],
	url: string
):
	| { present: string[]; alsoPresent: string[]; line: string; newIndex: number }
	| undefined {
	// Skip lines that are not useful based on certain conditions

	if (!shouldSkipLine(line) && !lines[i - 1].endsWith('-')) {
		if (line.endsWith('-')) {
			// Where line is hyphenated at end, removes - and adds line to next line
			line = line.slice(0, line.length - 1) + lines[i + 1];
			i++;
		}

		if (
			line.includes(',*') ||
			line.includes('.*') ||
			line.includes('.+') ||
			line.includes(',+')
		) {
			// Clauses to find attendees who were there in absence of another member
			const replacementAttendees = parseReplacementAttendees(line);
			if (replacementAttendees.present)
				present.push(...replacementAttendees.present);
			if (replacementAttendees.alsoPresent)
				alsoPresent.push(...replacementAttendees.alsoPresent);
		} else if (line.includes('attendance:')) {
			// If the line includes 'in attendance', extract additional attendees' names
			let names = line.slice(line.indexOf(':') + 1);
			if (!line.endsWith('.')) {
				// Deal with lines that go on to the second line
				names += lines[i + 1];
				i++;
			}
			const additionalNames = parsePresentLine(names, allMembers);
			if (!additionalNames) console.error(lines);
			else alsoPresent.push(...additionalNames);
		} else if (line.includes('in the absence')) {
			const potentialName = formatPresentStr(line.split('in the absence')[0]);
			if (potentialName!) {
				alsoPresent.push(potentialName);
			}
			if (!line.endsWith('.'))
				// Avoids absent member being recorded as present
				i++;
		} else {
			// formatPresentStr the names of the present attendees
			const processedNames = parsePresentLine(line, allMembers);
			if (processedNames) {
				present.push(...processedNames);
			} else console.log(`'${line}' not processed for: `, url);
		}
		return { present, alsoPresent, line, newIndex: i };
	}
}

function shouldSkipLine(line: string): boolean {
	const unwantedLineRegex =
		/present|\/ (deputies|senators)|\/(deputies|senators)|\d|clerk/;
	return unwantedLineRegex.test(line.toLowerCase());
}

// Deals with attendees their in the absence of a member
function parseReplacementAttendees(line: string): {
	present: string[];
	alsoPresent: string[];
} {
	const present: string[] = [];
	const alsoPresent: string[] = [];
	const parts = line.split(/,\.|,|\./); // Split based on comma or period and comma

	for (let i = 0; i < parts.length; i++) {
		const part = formatPresentStr(parts[i]);
		if (!part) continue;

		if (
			i < parts.length - 1 &&
			(parts[i + 1] === '*' || parts[i + 1] === '+')
		) {
			// Check if the next part contains '*' or '+'
			if (parts[i + 1] === '*') {
				alsoPresent.push(part);
			} else {
				const nextPart = formatPresentStr(parts[i + 2]);
				if (nextPart) {
					alsoPresent.push(part);
					alsoPresent.push(nextPart);
				}
				i++; // Skip the next part as it has been processed
			}
			i++; // Skip the marker part (* or +)
		} else {
			present.push(part);
		}
	}
	return { present, ...(alsoPresent! && { alsoPresent: alsoPresent }) };
}

export { parseLine };
