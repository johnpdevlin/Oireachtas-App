/** @format */

import formatCommitteeDebates from '@/Functions/API-Calls/OireachtasAPI/Format/committeeDebates';
import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import parseCommitteeReport from '@/Functions/GetWebsiteData/Oireachtas/Committee/parseOneReport';
import scrapeCommitteeInfo from '@/Functions/GetWebsiteData/Oireachtas/Committee/scapePageInfo';
import scrapeCommitteesBaseDetails from '@/Functions/GetWebsiteData/Oireachtas/Committee/scrapeAllCommittees';
import { dateToYMDstring, getDateTwoWeeksAgo } from '@/Functions/Util/dates';

import { CommitteeDebateRecord } from '@/Models/OireachtasAPI/debate';
import { Chamber } from '@/Models/_utility';

export type RawCommitteeAttendance = {
	date: Date;
	dateStr: string;
	name: string;
	uri: string;
	subURI: string;
	type: string;
	chamber: Exclude<Chamber, 'dail & seanad'>;
	houseNo: number;
	pdf: string;
	xml: string;
	attendees: string[];
	alsoPresent: string[];
};
export default async function processCommitteeReportsBetweenDates(
	date_start: string,
	date_end?: string
): Promise<RawCommitteeAttendance[]> {
	console.log(`Records to be processed between ${date_start} and ${date_end}`);
	console.log('Fetching and formatting debate records');
	const committeeDebates: Promise<CommitteeDebateRecord[]> = fetchDebates(
		{
			date_start: date_start,
			date_end: date_end,
			chamber_type: 'committee',
		},
		formatCommitteeDebates
	) as Promise<CommitteeDebateRecord[]>;

	const boundReports = bindReportsToDebateRecords(await committeeDebates);

	return boundReports;
}

async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[]
): Promise<RawCommitteeAttendance[]> {
	const parsed: RawCommitteeAttendance[] = [];

	const total = records.length;
	console.log(`binding ${total} reports to records...`);

	let count = 0;
	for (const record of records) {
		count++;
		if (record.pdf) {
			const report = await parseCommitteeReport(record.pdf);
			parsed.push({
				date: record.date,
				dateStr: record.dateStr,
				name: record.name,
				uri: record.uri!,
				subURI: record.subURI,
				type: record.type!,
				houseNo: record.houseNo,
				chamber: record.chamber as Exclude<Chamber, 'dail & seanad'>,
				pdf: record.pdf,
				xml: record.xml!,
				attendees: report.present,
				alsoPresent: report.alsoPresent,
			});
		} else {
			console.error('issue with following record: ' + record);
		}
		setTimeout(() => bindReportsToDebateRecords, 70); //
		if (count % 100 === 0) {
			console.log(`${count} bound...`);
			break;
		}
	}
	console.log(
		`${count} reports successfully bound to records. Process completed.`
	);
	return parsed;
}
