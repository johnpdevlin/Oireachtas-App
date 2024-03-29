/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { parseLine } from './parse_line';
import { splitStringIntoLines } from '../../../../_utils/strings';
import { RawCommittee } from '@/models/oireachtasApi/committee';
import { fetchRawTextFromUrlWithRetry } from '@/functions/_utils/fetch_raw_text_from_url';
import { verifyInitialAttendance } from '../process/initial_attendance_verification';

export default async function parseCommitteeReport(
	url: string,
	committee: RawCommittee,
	allMembers: RawMember[],
	date: Date
) {
	try {
		if (!url) return;

		const text = (await fetchRawTextFromUrlWithRetry(url)).toLowerCase();
		const lines = splitStringIntoLines(text);

		let searching = false;
		let present: string[] = [];
		let alsoPresent: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			if (line!) {
				// Check if the line indicates the start of attendee information
				if (
					(present.length === 0 &&
						(line.includes('present') || line.includes('i láthair'))) ||
					(url ===
						'https://data.oireachtas.ie/ie/oireachtas/debateRecord/select_committee_on_education_and_skills/2017-05-16/debate/mul@/main.pdf' &&
						line.includes('deputies'))
				) {
					searching = true;
				}

				if (searching && line.includes(' ') && line.length > 6) {
					const parsedLine = parseLine(
						line,
						lines,
						i,
						present,
						alsoPresent,
						allMembers,
						url
					);

					if (parsedLine) {
						line = parsedLine.line;
						i = parsedLine.newIndex;
						present = parsedLine.present;
						alsoPresent = parsedLine.alsoPresent;
					}
				}
				// Check if the line indicates the end of attendee information
				if (
					line.includes('the chair') ||
					line.includes('sa chathaoir') ||
					(alsoPresent.length > 0 && line === '1')
				) {
					searching = false;
					break;
				}
			}
		}

		const verifiedAttendance = verifyInitialAttendance(
			url,
			date,
			present,
			alsoPresent,
			committee,
			allMembers
		);

		return verifiedAttendance;
	} catch (error) {
		console.log(url, error);
	}
}
