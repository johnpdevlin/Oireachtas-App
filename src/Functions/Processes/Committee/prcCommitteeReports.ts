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

	// YYYY-MM-DD format
	const debates: Promise<DebateRecord[]> = fetchDebates({
		// Call to API to retrieve debate records
		date_start: date_start,
		date_end: date_end,
		chamber_type: 'committee',
	});

	// get uris / urls etc
	const committeeInfo = await scrapeCommitteesBaseDetails();
	console.log(committeeInfo);
	const committees = committeeInfo.map(async (c) => {
		const info = await scrapeCommitteeInfo(c.dailNo, c.uri);
		if (!info) return c.uri;
		return info;
	});

	console.log(committees);
	// then use scrape individual committees
	// cross reference members below

	const records = (await debates).map((deb: DebateRecord) => {
		// Map to get pdf URLs for committee meetings
		const date = new Date(deb.contextDate);

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

	for (const r of records) {
		if (r.pdf !== undefined) {
			const att = await parseCommitteeReport(r.pdf);
			const attendees = att.present;
			const alsoPresent = att.alsoPresent;
			parsedReports.push({
				date: new Date(r.date),
				committee_name: r.committee_name,
				committee_uri: r.uri!,
				pdf: r.pdf,
				xml: r.xml,
				attendees: attendees,
				alsoPresent: alsoPresent,
			});
		}
	}

	console.log(parsedReports);
	return parsedReports;
}
