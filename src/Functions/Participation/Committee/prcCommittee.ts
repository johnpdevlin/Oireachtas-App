/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import parseCommitteeReport from '@/Functions/GetWebsiteData/Oireachtas/parseCommitteeReport';
import { capitaliseFirstLetters } from '@/Functions/Util/strings';

type CommitteeAttendance = {
	date: Date;
	name: string;
	uri: string;
	pdf: string;
	xml: string;
	attendees: string[];
	alsoPresent: string[];
};
export default async function prcCommitteeReports(
	date_start: string,
	date_end?: string
): Promise<CommitteeAttendance[]> {
	if (!date_start) return [];
	if (!date_end) date_end = '2099-01-01'; //

	// YYYY-MM-DD format
	const debates = fetchDebates({
		// Call to API to retrieve debate records
		date_start: date_start,
		date_end: date_end,
		chamber_type: 'committee',
	});

	const records = (await debates).map((deb) => {
		// Map to get pdf URLs for committee meetings
		const date = new Date(deb.contextDate);
		const name = capitaliseFirstLetters(
			deb.debateRecord.house.showAs.toLowerCase()
		);
		const uri = deb.debateRecord.house.committeeCode;
		let pdf, xml;
		if (deb.debateRecord.formats.pdf) {
			pdf = deb.debateRecord.formats.pdf.uri;
		}
		if (deb.debateRecord.formats.xml) {
			xml = deb.debateRecord.formats.xml.uri;
		}
		return {
			date,
			name,
			uri,
			pdf,
			xml,
		};
	});

	const parsedRecords: CommitteeAttendance[] = records.map(async (r) => {
		// Parse pdf report to get attendee info for committee meeting
		if (r.pdf !== undefined) {
			const att = await parseCommitteeReport(r.pdf);
			const present = att.present;
			const alsoPresent = att.alsoPresent;
			return { ...r, present, alsoPresent };
		}
	});

	return parsedRecords;
}
