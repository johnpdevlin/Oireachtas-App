/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeType, MemberBaseKeys } from '@/models/_utils';
import { Committee } from '@/models/committee';
import axios from 'axios';
import he from 'he';
import { verifyAttendance } from '../process/verify_attendance';
import { parseLine } from './parse_line';
import { splitStringIntoLines } from '../../../../_utils/strings';

type ParsedReport = {
	type: string;
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};
export default async function parseCommitteeReport(
	url: string,
	committee: Committee,
	allMembers: RawMember[],
	date: Date
): Promise<ParsedReport | undefined> {
	try {
		if (!url) return;

		const text = (await fetchRawTextFromUrl(url)).toLowerCase();
		const lines = splitStringIntoLines(text);

		let searching = false;
		let present: string[] = [];
		let alsoPresent: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			if (line!) {
				// Check if the line indicates the start of attendee information
				if (
					present.length === 0 &&
					(line.includes('present') || line.includes('i láthair'))
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

		const verifiedAttendance = verifyAttendance(
			getCommitteeType(url, committee)!,
			present,
			committee,
			allMembers,
			date,
			alsoPresent
		);

		if (committee.uri.includes('seanad_public_consultation_committee')) {
			console.log(verifiedAttendance);
			console.log(text);
		}

		return verifiedAttendance;
	} catch (error) {
		console.log(url, error);
	}
}

async function fetchRawTextFromUrl(url: string): Promise<string> {
	const response = await axios.get(`api/pdf2text?url=${url}`);
	return he.decode(response.data.text);
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
