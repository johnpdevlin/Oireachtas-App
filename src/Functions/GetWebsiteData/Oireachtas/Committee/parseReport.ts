/** @format */

import { assignMemberURIsAndNames } from '@/Functions/Util/memberURIs';
import {
	capitaliseFirstLetters,
	removeTextAfterParenthesis,
} from '@/Functions/Util/strings';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import { URIpair } from '@/Models/_utility';
import { Committee } from '@/Models/committee';
import axios from 'axios';
import he from 'he';
import { removeDuplicateObjects } from '../../../Util/arrays';

export default async function parseCommitteeReport(
	url: string,
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date
): Promise<{ present: URIpair[]; absent: URIpair[]; alsoPresent: URIpair[] }> {
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
						line.includes('/ deputies') ||
						line.includes('/ senators') ||
						line.includes('1') ||
						line.includes('clerk') ||
						line === '' ||
						line.includes(')');
					if (!shouldSkipLine && !lines[i - 1].endsWith('-')) {
						if (line) {
							if (line.endsWith('-')) {
								// Where line is hyphenated at end, removes - and adds line to next line
								line = line.slice(0, line.length - 1) + lines[i + 1];
							}
							if (line.includes(',*') || line.includes('.*')) {
								// Clause to find attendees who were there in absence of a member
								const count = line.split('*');
								let alsos = line.split(',');
								if (count.length > 2) {
									const additionalNames = formatPresentString(line, allMembers);
									alsoPresent.push(...additionalNames);
									line = '';
								} else if (count.length === 2) {
									if (line.endsWith('*')) {
										const additionalName = formatPresentString(
											alsos[1],
											allMembers
										);
										alsoPresent.push(...additionalName);
										line = alsos[0];
									} else {
										const additionalName = formatPresentString(
											alsos[0],
											allMembers
										);
										alsoPresent.push(...additionalName);
										line = alsos[1];
									}
								}
							}
							if (line.includes('in attendance')) {
								// If the line includes 'in attendance', extract additional attendees' names
								const additionalNames = formatPresentString(line, allMembers);
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
									const processedNames = formatPresentString(line, allMembers);
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

			const verifiedAttendance = verifyAttendance(
				present,
				alsoPresent,
				committee,
				allMembers,
				date
			);
			return verifiedAttendance;
		}
	} catch (error) {
		console.log(url, error);
	}

	// Return [] if an error occurred or if the URL is undefined
	return { present: [], absent: [], alsoPresent: [] };
}

// Cross references names against members of committees
// Checks for pastMembers who are current for given date
// Returns verified attendances and absences
function verifyAttendance(
	present: string[],
	alsoPresent: string[],
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date
): { present: URIpair[]; absent: URIpair[]; alsoPresent: URIpair[] } {
	// Remove any undefined values from the arrays
	present = present.filter(Boolean);
	alsoPresent = alsoPresent.filter(Boolean);

	if (!committee.members) {
		console.warn(`Why does this committee not have members? ${committee}`);
	}
	const members = committee.members;
	const nonMembers: URIpair[] = allMembers
		.filter((am) => committee.members.every((com) => com.uri !== am.uri))
		.map((member) => {
			return { name: member.name, uri: member.uri };
		});

	if (committee.pastMembers && committee.pastMembers.length > 0) {
		// Ascertain how current pastMembers should be dealt with
		// Some will be current for reports before their endDate
		committee.pastMembers.forEach((member) => {
			if (
				date.getTime() > member.dateRange.date_end.getTime() &&
				date.getTime() < member.dateRange.date_start.getTime()
			) {
				members.push(member);
			} else {
				nonMembers.push(member);
			}
		});
	}

	// Verifies and matches names and uris
	// Finds absences
	const confirmedPresent = assignMemberURIsAndNames(present, members);
	const confirmedAbsent = members.filter(
		(member) => !confirmedPresent.matches.some((cp) => cp.uri == member.uri)
	);
	confirmedPresent.unMatchedURIs &&
		alsoPresent.push(...confirmedPresent.unMatchedURIs!);
	const confirmedAlsoPresent = assignMemberURIsAndNames(
		alsoPresent,
		nonMembers
	);

	if (
		confirmedAlsoPresent.unMatchedURIs &&
		confirmedAlsoPresent.unMatchedURIs.length > 0
	) {
		console.warn(`No matches found for ${confirmedAlsoPresent.unMatchedURIs}`);
	}
	const edgeCase = confirmedAlsoPresent.matches.filter((conAlso) =>
		confirmedPresent.matches.some((conAb) => conAb.uri === conAlso.uri)
	);

	if (edgeCase.length > 0) {
		console.warn(
			`Issue with ${edgeCase} \n Being picked up as also present rather than present.`
		);
	}

	return {
		present: removeDuplicateObjects(confirmedPresent.matches),
		absent: removeDuplicateObjects(confirmedAbsent),
		alsoPresent: removeDuplicateObjects(confirmedAlsoPresent.matches),
	};
}

function formatPresentString(
	presence: string,
	members?: RawFormattedMember[]
): string[] {
	// Check for direct matches
	if (members) {
		presence.includes('’') && presence.replace('’', "'").toLowerCase();
		const matchedMembers = members
			?.filter((mem) => presence.includes(mem.name.toLowerCase()))
			.map((mem) => mem.name.toLowerCase());
		if (matchedMembers && matchedMembers.length > 0) {
			matchedMembers.forEach((mem) => presence.replace(mem, ''));
			return [...formatPresentString(presence), ...matchedMembers];
		}
	}

	// Check if presence indicates "in attendance"
	if (presence.includes('in attendance')) {
		let present: string = presence;
		if (presence.includes(':')) present = presence.split(':')[1].trim(); // Extract the name after the colon
		return formatPresentString(present, members); // Format the name and return it as a single-element array
	}

	// Check if presence contains commas or and(multiple names separated by commas or and)
	if (
		(presence.includes(',') && !presence.endsWith(',')) ||
		presence.includes('and ')
	) {
		const present = presence
			.split(/(?:,|and )/) // Split by comma followed by space, and/or and followed by a space
			.map((name) => format(name.trim()))
			.filter(Boolean);

		present.forEach((p) => {
			if (p.includes(',')) {
				console.log('WTF!!!!');
			}
		});

		return present;
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

	if (presence.split('.').length > 1) {
		const present: string[] = presence
			.split('.')
			.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
			.filter(Boolean); // Filter out any empty or undefined names
		return present; // Return the array of formatted names
	}

	// If none of the above conditions match, treat the presence as a single name
	return [format(presence)]; // Format the name and return it as a single-element array
}

function format(pr: string): string {
	// remove unneccessary characters
	if (pr == undefined || pr.length < 5 || !pr.includes(' ')) {
		return '';
	}
	pr = pr.toLowerCase().trim();

	if (pr.includes('’')) pr.replace('’', "'");
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
	if (pr.includes('in éagmais')) pr = pr.replace('in éagmais', '');
	if (pr.includes('in the chair')) pr = pr.replace('in the chair', '');
	if (pr.includes('sa chathaoir')) pr = pr.replace('sa chathaoir', '');
	if (pr.includes('comhaltaí a bhí')) pr = pr.replace('comhaltaí a bhí', '');

	if (pr.length === 0) {
		return '';
	}

	pr = capitaliseFirstLetters(pr.trim());
	return pr;
}
