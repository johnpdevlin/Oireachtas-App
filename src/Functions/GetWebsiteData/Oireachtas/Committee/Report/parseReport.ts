/**
 * @format
 * @formatPresentStr
 */
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import { CommitteeType, MemberBaseKeys } from '@/Models/_utility';
import { Committee } from '@/Models/committee';
import axios from 'axios';
import he from 'he';
import { formatPresentStr, parsePresentLine } from './parsePresentLine';
import { verifyAttendance } from './verifyAttendance';

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
									let temp = '';

									if (line.endsWith('.*')) temp = line.replaceAll('.*', '');
									else temp = line.replaceAll(',*', '');

									if (temp.includes('.')) alsos = temp.split('.');
									else if (temp! && temp.includes(',')) alsos = temp.split(',');

									if (count.length > 2) {
										const additionalNames = parsePresentLine(temp, allMembers);
										if (additionalNames!) {
											alsoPresent.push(...additionalNames);
											line = '';
										}
									} else if (count.length === 2) {
										if (line.endsWith('*')) {
											const presentName = formatPresentStr(alsos[0]);
											const alsoName = formatPresentStr(alsos[1]);

											if (presentName!) present.push(presentName!);
											if (alsoName!) alsoPresent.push(alsoName!);
										} else {
											const presentName = formatPresentStr(alsos[1]);
											const alsoName = formatPresentStr(alsos[0]);
											if (presentName!) present.push(presentName!);
											if (alsoName!) alsoPresent.push(alsoName!);
										}
									} else console.log('???');
								} else if (line.includes('+')) {
									const count = line.split('+');
									let alsos: string[] = [];
									let temp = '';

									if (line.endsWith('.+')) temp = line.replaceAll('.+', '');
									else temp = line.replaceAll(',+', '');

									if (temp.includes('.')) alsos = temp.split('.');
									else if (temp! && temp.includes(',')) alsos = temp.split(',');

									if (count.length > 2) {
										const additionalNames = parsePresentLine(temp, allMembers);
										if (additionalNames!) {
											alsoPresent.push(...additionalNames);
											line = '';
										}
									} else if (count.length === 2) {
										if (line.endsWith('+')) {
											const presentName = formatPresentStr(alsos[0]);
											const alsoName = formatPresentStr(alsos[1]);

											if (presentName!) present.push(presentName!);
											if (alsoName!) alsoPresent.push(alsoName!);
										} else {
											const presentName = formatPresentStr(alsos[1]);
											const alsoName = formatPresentStr(alsos[0]);
											if (presentName!) present.push(presentName!);
											if (alsoName!) alsoPresent.push(alsoName!);
										}
									} else console.log('???');
								}
							}
							if (line!) {
								if (line.includes('attendance:')) {
									// If the line includes 'in attendance', extract additional attendees' names
									let names = line.slice(line.indexOf(':') + 1);
									if (!line.endsWith('.')) {
										// deal with lines which go on to second line
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
									if (potentialName!) alsoPresent.push(potentialName);
									if (!line.endsWith('.'))
										// avoids absent member being recorded as present
										i++;
								} else {
									// formatPresentStr the names of the present attendees
									const processedNames = parsePresentLine(line, allMembers);
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

			const verifiedAttendance = verifyAttendance(
				type!,
				present,
				committee,
				allMembers,
				date,
				alsoPresent
			);

			return verifiedAttendance;
		}
	} catch (error) {
		console.log(url, error);
	}

	// Return [] if an error occurred or if the URL is undefined
	return { present: [], absent: [], alsoPresent: [] };
}
