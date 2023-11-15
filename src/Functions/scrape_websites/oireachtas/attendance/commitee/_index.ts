/** @format */

import formatCommitteeDebates from '@/functions/APIs_/Oireachtas_/debate_/Format/committeeDebates';
import fetchDebates from '@/functions/APIs_/Oireachtas_/debate_/get';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/Formatted/debate';
import { bindReportsToDebateRecords } from './bind_reports2debate_records';

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeAttendance } from '@/models/scraped/oireachtas/committee';
import { getDateTwoWeeksAgo, dateToYMDstring } from '@/functions/_utils/dates';
import processAllCommitteeInfo from '../../committee/web/get/all_committeesInfo';
import fetchMembers from '@/functions/APIs_/Oireachtas_/member_/get_/raw_/get';

/** 
	Fetches from Orieachtas API: debates, members
	Scrapes base committee info
	Passes above for processing
	Verifies attendance which cross references against above
	and with additional scrapes called within called functions 
**/
export default async function processCommitteeReportsBetweenDates(
	date_start: string,
	date_end: string
): Promise<CommitteeAttendance[]> {
	// variable to allow for time for oir records to be available
	const twoWeeksPast = getDateTwoWeeksAgo();

	if (!date_start) return [];
	if (!date_end || new Date(date_end!).getTime() > twoWeeksPast)
		// To allow time for pdfs to be uploaded
		date_end = dateToYMDstring(new Date(twoWeeksPast));

	console.log(`Records to be processed between ${date_start} and ${date_end}`);
	console.log('Fetching and formatting debate records . . .');

	const formattedCommitteeDebates: Promise<CommitteeDebateRecord[]> =
		fetchDebates(
			{
				date_start: date_start,
				date_end: date_end,
				chamber_type: 'committee',
			},
			formatCommitteeDebates
		) as Promise<CommitteeDebateRecord[]>;

	console.log('Fetching base committee details and members . . .');
	const baseCommittees = (await processAllCommitteeInfo()).map((bc) => {
		return { ...bc, records: [] };
	});

	const allMembers = (await fetchMembers({
		date_start: date_start,
		date_end: date_end,
	})) as RawMember[];

	const processedAttendanceRecords = await bindReportsToDebateRecords(
		await formattedCommitteeDebates,
		baseCommittees,
		allMembers
	);

	return processedAttendanceRecords;
}
