/** @format */

import { assignMemberURIsAndNames } from '@/Functions/Util/memberURIs';
import {
	capitaliseFirstLetters,
	removeTextAfterParenthesis,
	removeTextBetweenParentheses,
} from '@/Functions/Util/strings';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import {
	BinaryChamber,
	CommitteeType,
	MemberBaseKeys,
} from '@/Models/_utility';
import { Committee } from '@/Models/committee';
import axios from 'axios';
import he from 'he';
import { removeDuplicateObjects } from '../../../Util/arrays';
import { PastCommitteeMember } from '../../../../Models/committee';

export default async function parseCommitteeReport(
	url: string,
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date
): Promise<{
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
}> {
	try {
		if (url !== undefined) {
			// Fetches raw pdf txt from committee report
			const response = await axios.get(`api/pdf2text?url=${url}`);
			const text = he.decode(response.data.text);
			const lines = text?.split('\n');

			if (
				url ===
				'https://data.oireachtas.ie/ie/oireachtas/debateRecord/joint_committee_on_agriculture_food_and_the_marine/2023-07-13/debate/mul@/main.pdf'
			) {
				console.log(text);
			}

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
						const shouldSkipLine =
							line.includes('present') ||
							line.includes('/ deputies') ||
							line.includes('/ senators') ||
							line.includes('1') ||
							line.includes('clerk');

						if (!shouldSkipLine && !lines[i - 1].endsWith('-')) {
							if (line.endsWith('-'))
								// Where line is hyphenated at end, removes - and adds line to next line
								line = line.slice(0, line.length - 1) + lines[i + 1];

							if (
								line.includes(',*') ||
								line.includes('.*') ||
								line.includes('.+') ||
								line.includes(',+')
							) {
								// Clauses to find attendees who were there in absence of a member
								if (line.includes('*')) {
									const count = line.split('*');
									let alsos: string[] = [];
									if (line.endsWith('.*') && line.split('.').length === 2)
										alsos = line.split('.');
									else alsos = line.split(',');
									if (line.endsWith(',*') && line.split(',').length === 2)
										alsos = line.split(',');
									else alsos = line.split('.');

									if (count.length > 2) {
										const additionalNames = formatPresentString(
											line,
											allMembers
										);
										if (additionalNames!) {
											alsoPresent.push(...additionalNames);
											line = '';
										}
									} else if (count.length === 2) {
										if (line.endsWith('*')) {
											const additionalName = formatPresentString(
												alsos[1],
												allMembers
											);
											if (additionalName!) {
												alsoPresent.push(additionalName[1]);
												present.push(additionalName[0]);
											}
										} else {
											const additionalName = formatPresentString(
												alsos[0],
												allMembers
											);
											if (additionalName!) {
												alsoPresent.push(additionalName[1]);
												present.push(additionalName[0]);
											}
										}
									} else if (line.includes('*')) {
										const count = line.split('+');
										let alsos: string[] = [];
										if (line.endsWith('.+') && line.split('.').length === 2)
											alsos = line.split('.');
										else alsos = line.split(',');
										if (line.endsWith(',+') && line.split(',').length === 2)
											alsos = line.split(',');
										else alsos = line.split('.');

										if (count.length > 2) {
											const additionalNames = formatPresentString(
												line,
												allMembers
											);
											if (additionalNames!) {
												alsoPresent.push(...additionalNames);
												line = '';
											}
										} else if (count.length === 2) {
											if (line.endsWith('+')) {
												const additionalName = formatPresentString(
													alsos[1],
													allMembers
												);
												if (additionalName!) {
													alsoPresent.push(additionalName[1]);
													present.push(additionalName[0]);
												}
											} else {
												const additionalName = formatPresentString(
													alsos[0],
													allMembers
												);
												if (additionalName!) {
													alsoPresent.push(additionalName[1]);
													present.push(additionalName[0]);
												}
											}
										}
									}
								}
							}
							if (line!) {
								if (line.includes('attendance:')) {
									// If the line includes 'in attendance', extract additional attendees' names
									if (
										url ===
										'https://data.oireachtas.ie/ie/oireachtas/debateRecord/joint_committee_on_agriculture_food_and_the_marine/2023-07-13/debate/mul@/main.pdf'
									)
										console.log(line);
									let names = line.slice(line.indexOf(':') + 1);
									if (!line.endsWith('.')) {
										// deal with lines which go on to second line
										names += lines[i + 1];
										i++;
									}
									const additionalNames = formatPresentString(
										names,
										allMembers
									);
									if (!additionalNames) console.error(lines);
									else alsoPresent.push(...additionalNames);
								} else if (line.includes('in the absence')) {
									const potentialName = format(line.split('in the absence')[0]);
									if (potentialName!) alsoPresent.push(potentialName);
									if (!line.endsWith('.'))
										// avoids absent member being recorded as present
										i++;
								} else {
									// Format the names of the present attendees
									const processedNames = formatPresentString(line, allMembers);
									if (processedNames!) {
										present.push(...processedNames);
									} else console.log(line);
								}
							}
						}
					}
					// Check if the line indicates the end of attendee information
					if (line! && line.includes('the chair')) {
						searching = false;
						break;
					}
				}
			}

			// Get committee type
			let type: CommitteeType;
			if (committee && committee.types! && committee.types!.length === 1)
				type = committee.types[0];
			else if (url.includes('joint') || url.includes('comh')) type = 'joint';
			else if (url.includes('select') || url.includes('rogh')) type = 'select';
			else if (url.includes('standing')) type = 'standing';
			else if (url.includes('working')) type = 'working group';
			else if (!committee || !committee.types)
				console.log(`no types for ${url}`);
			// if (
			// 	url ===
			// 	'https://data.oireachtas.ie/ie/oireachtas/debateRecord/seanad_select_committee_on_scrutiny_of_draft_eu_related_statutory_instruments/2023-07-04/debate/mul@/main.pdf'
			// ) {
			// 	console.log(present);
			// 	console.log(alsoPresent);
			// 	console.log(type!);
			// 	console.log(committee);
			// 	console.log(allMembers);
			// 	console.log(date);
			// }

			try {
				const verifiedAttendance = verifyAttendance(
					type!,
					present,
					committee,
					allMembers,
					date,
					alsoPresent
				);

				return verifiedAttendance;
			} catch (err) {
				console.log(err);
				console.log(url);
				console.log(type!);
				console.log(present);
				console.log(committee);
				console.log(allMembers);
				console.log(date);
				console.log(alsoPresent);
			}
		}
	} catch (error) {
		console.log(url, error);
	}

	// Return [] if an error occurred or if the URL is undefined
	return { present: [], absent: [], alsoPresent: [] };
}

// Cross references names against members of committees and if select or joint etc.
// Checks for pastMembers who are current for given date
// Returns verified attendances and absences
function verifyAttendance(
	type: CommitteeType,
	present: string[],
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date,
	alsoPresent?: string[]
): {
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
} {
	// Remove any undefined values from the arrays
	let chamber: BinaryChamber = 'dail';

	// Get members specific to joint or select committees etc.
	const members: MemberBaseKeys[] = [];
	if (committee.members!) {
		const dail = committee.members?.dail;
		const seanad = committee.members?.seanad;
		if (dail!) {
			members.push(...(committee.members.dail as MemberBaseKeys[]));
		}
		if (seanad!) {
			if (type === 'select') chamber = 'seanad';
			if ((chamber === 'dail' && type !== 'select') || chamber === 'seanad')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
		}
	} else {
		console.log('no committee');
	}
	// Filter out oireachtas members that aren't on committee
	const nonMembers: MemberBaseKeys[] = allMembers
		.filter((am) => members.every((com) => com.uri !== am.uri))
		?.map((member) => {
			return {
				name: member.name,
				uri: member.uri,
				houseCode: chamber,
			};
		});

	// Ascertain how current pastMembers should be dealt with
	// Some will be current for reports before their endDate
	const pastMembers: PastCommitteeMember[] = [];
	if (committee.pastMembers!) {
		// Get members specific to joint or select committees etc.
		const dail = committee.pastMembers?.dail;
		const seanad = committee.pastMembers?.seanad;
		if (dail! && dail!.length > 0) {
			pastMembers.push(...(dail as PastCommitteeMember[]));
		}
		if (seanad! && seanad!.length > 0) {
			if (type === 'select') chamber = 'seanad';
			if (chamber === 'dail' && type !== 'select')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
			else if (chamber === 'seanad')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
			if (type === 'select') chamber = 'seanad';
			if ((chamber === 'dail' && type !== 'select') || chamber === 'seanad')
				pastMembers.push(...(seanad as PastCommitteeMember[]));
		}
		pastMembers.forEach((member) => {
			const mDateRange = member.dateRange;
			const memberObj: MemberBaseKeys = {
				uri: member.uri,
				name: member.name,
				houseCode: member.houseCode,
			};
			if (date.getTime() > mDateRange.date_start.getTime()) {
				if (
					mDateRange.date_end! &&
					date.getTime() > mDateRange.date_end.getTime()
				)
					members.push(memberObj);
			} else {
				nonMembers.push(memberObj);
			}
		});
	}

	const confirmedPresent = assignMemberURIsAndNames(present, members);
	const confirmedAbsent = members.filter(
		(member) => !confirmedPresent.matches.some((cp) => cp.uri == member.uri)
	);

	// Handle possible attendees picked up as committee members
	if (confirmedPresent.unMatchedURIs!)
		if (!alsoPresent) alsoPresent = [...confirmedPresent.unMatchedURIs!];
		else if (alsoPresent!)
			alsoPresent = [...alsoPresent, ...confirmedPresent.unMatchedURIs];

	let confirmedAlsoPresent;
	if (alsoPresent! && alsoPresent.length > 0) {
		confirmedAlsoPresent = assignMemberURIsAndNames(alsoPresent, nonMembers);
		if (
			confirmedAlsoPresent.unMatchedURIs &&
			confirmedAlsoPresent.unMatchedURIs.length > 0
		) {
			console.warn(
				`No matches found for ${confirmedAlsoPresent.unMatchedURIs}`
			);
		}
		const edgeCase = confirmedAlsoPresent.matches.filter((conAlso) =>
			confirmedPresent.matches.some((conAb) => conAb.uri === conAlso.uri)
		);
		if (edgeCase.length > 0) {
			console.warn(
				`Issue with ${edgeCase} \n Being picked up as also present rather than present.`
			);
		}
	}

	return {
		present: removeDuplicateObjects(confirmedPresent.matches),
		...(confirmedAlsoPresent! && {
			alsoPresent: removeDuplicateObjects(confirmedAlsoPresent.matches),
		}),
		...(confirmedAbsent! && {
			absent: removeDuplicateObjects(confirmedAbsent),
		}),
	};
}

function formatPresentString(
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
				const present = formatPresentString(presence);
				if (present!) return [...present, ...matchedMembers];
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
				.filter((name) => name !== '')
				.filter(Boolean);

			present.forEach((p) => {
				if (p! && p.includes(',')) {
					console.log('Why does this presence string contain a comma?', p);
				}
			});

			if (present!) return present as string[]; // Return the array of formatted names
		}

		// Check that name not in format of John J. Joe
		if (
			presence.includes('.') &&
			presence.charAt(presence.indexOf('.') - 1) !== ' '
		) {
			const present = presence
				.split('.')
				.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);

			if (present!) return present as string[]; // Return the array of formatted names
		}

		if (presence.split('.').length > 1) {
			const present = presence
				.split('.')
				.map((name) => format(name.trim())) // Format each name and remove leading/trailing whitespace
				.filter((name) => name !== '')
				.filter(Boolean);
			if (present!) return present as string[]; // Return the array of formatted names
		}

		// If none of the above conditions match, treat the presence as a single name
		// Format the name and return it as a single-element array
		const formattedString = format(presence);
		if (formattedString!) return [formattedString]; //
	} else {
		return undefined;
	}
}

function format(pr: string): string | undefined {
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
	if (pr.includes('(')) {
		if (pr.includes(')')) pr = removeTextBetweenParentheses(pr);
		else pr = removeTextAfterParenthesis(pr);
	}
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
