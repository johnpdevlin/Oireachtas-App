/** @format */

import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import { CommitteeType, MemberBaseKeys } from '@/Models/_utility';
import { Committee } from '@/Models/committee';
import axios from 'axios';
import he from 'he';
import { formatPresentStr, parsePresentLine } from './parsePresentLine';
import { verifyAttendance } from './verifyAttendance';

type ParsedReport = {
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};
export default async function parseCommitteeReport(
	url: string,
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date
): Promise<ParsedReport | void> {
	try {
		if (!url) return { present: [], absent: [], alsoPresent: [] };
		const text = await fetchRawTextFromUrl(url);
		const lines = text.split('\n');

		let searching = false;
		let present: string[] = [];
		let alsoPresent: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].toLowerCase();

			if (line!) {
				// Check if the line indicates the start of attendee information
				if (line.includes('present')) {
					searching = true;
				}

				if (searching && line.includes(' ') && line.length > 6) {
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
							const potentialName = formatPresentStr(
								line.split('in the absence')[0]
							);
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
					}
				}
				// Check if the line indicates the end of attendee information
				if (line.includes('the chair')) {
					searching = false;
					break;
				}
			}
		}

		const verifiedAttendance = verifyAttendance(
			getCommitteeType(url, committee)!,
			present,
			committee,
			allMembers,
			date,
			alsoPresent
		);

		return verifiedAttendance;
	} catch (error) {
		console.log(url, error);
		return;
	}
}

async function fetchRawTextFromUrl(url: string): Promise<string> {
	const response = await axios.get(`api/pdf2text?url=${url}`);
	return he.decode(response.data.text);
}

function shouldSkipLine(line: string): boolean {
	const unwantedLineRegex =
		/(\s+|present|\/\s*(deputies|senators)|\/?(deputies|senators)|\d|clerk)/;
	return unwantedLineRegex.test(line.toLowerCase());
}

function getCommitteeType(
	url: string,
	committee: Committee
): CommitteeType | void {
	if (committee && committee.types! && committee.types!.length === 1)
		return committee.types[0];
	else if (url.includes('joint') || url.includes('comh')) return 'joint';
	else if (url.includes('select') || url.includes('rogh')) return 'select';
	else if (url.includes('standing')) return 'standing';
	else if (url.includes('working')) return 'working group';
	else if (!committee || !committee.types) console.log(`no types for ${url}`);
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
