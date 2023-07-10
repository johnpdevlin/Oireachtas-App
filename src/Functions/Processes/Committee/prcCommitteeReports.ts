/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import parseCommitteeReport from '@/Functions/GetWebsiteData/Oireachtas/parseCommitteeReport';
import scrapeCommitteeInfo from '@/Functions/GetWebsiteData/Oireachtas/scapeCommitteeInfo';
import scrapeCommitteesBaseDetails from '@/Functions/GetWebsiteData/Oireachtas/scrapeAllCommittees';
import { capitaliseFirstLetters } from '@/Functions/Util/strings';
import { DebateRecord } from '@/Models/OireachtasAPI/debate';

type CommitteeAttendance = {
	date: Date;
	committee_name: string;
	committee_uri: string;
	pdf: string;
	xml: string;
	attendees: string[];
	alsoPresent: string[];
};
export default async function prcCommitteeReports(
	date_start: string,
	date_end?: string
): Promise<CommitteeAttendance[]> {
	// Run a month at a time at most to ensure that
	// the API doesn't time out
	if (!date_start) return [];
	if (!date_end) date_end = '2099-01-01';

	// Call to API to retrieve debate records
	const debates: Promise<DebateRecord[]> = fetchDebates({
		// YYYY-MM-DD format
		date_start: date_start,
		date_end: date_end,
		chamber_type: 'committee',
	});

	const records = (await debates).map((deb: DebateRecord) => {
		// Map to get pdf URLs for committee meetings
		const date = deb.date;

		const committee_name = capitaliseFirstLetters(
			deb.house.showAs.toLowerCase()
		);
		const uri = deb.house.committeeCode;
		let pdf, xml;
		if (deb.formats.pdf) {
			pdf = deb.formats.pdf.uri;
		}
		if (deb.formats.xml) {
			xml = deb.formats.xml.uri;
		}
		return {
			date,
			committee_name,
			uri,
			pdf,
			xml,
		};
	});

	const parsedReports: CommitteeAttendance[] = [];

	let count = 0;
	for (const r of records) {
		count++;
		if (r.pdf) {
			const att = await parseCommitteeReport(r.pdf);
			setTimeout(prcCommitteeReports, 50);
			parsedReports.push({
				date: new Date(r.date),
				committee_name: r.committee_name,
				committee_uri: r.uri!,
				pdf: r.pdf,
				xml: r.xml,
				attendees: att.present,
				alsoPresent: att.alsoPresent,
			});
		}
		if (count % 100 == 0) {
			console.log(count);
		}
	}

	console.log(parsedReports);

	// // Get all committee base details
	// const committeeInfo = await scrapeCommitteesBaseDetails();

	// // Get details for members of committee and other details
	// const committees = committeeInfo.map(async (c) => {
	// 	const info = await scrapeCommitteeInfo(c.dailNo, c.uri);
	// 	if (!info)
	// 		return console.error('issue with following committee scraping:', c.uri); // where
	// 	return info;
	// });

	return parsedReports;
}
