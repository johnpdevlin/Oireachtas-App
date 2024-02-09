/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeAttendance } from '@/models/committee';
import fetchDebates from '../../APIs/Oireachtas_/debate_/get';
import fetchMembers from '../../APIs/Oireachtas_/member_/get_/raw_/get';
import processAllCommitteeInfo from '@/functions/oireachtas_pages/committee/get/all_committeesInfo';
import { bindReportsToDebateRecords } from '@/functions/attendance/commitee/bind_reports2debate_records';
import { getDateTwoWeeksAgo, dateToYMDstring } from '@/functions/_utils/dates';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';

/** 
	Fetches from Orieachtas API: debates, members
	Scrapes base committee info
	Passes above for processing
	Verifies attendance which cross references against above
	and with additional scrapes called within called functions 
**/
export default async function processCommitteeReportsBetweenDates(
	date_start: string,
	date_end?: string
): Promise<CommitteeAttendance[]> {
	// variable to allow for time for oir records to be available
	const twoWeeksPast = getDateTwoWeeksAgo();

	if (!date_start) return [];
	if (!date_end || new Date(date_end!).getTime() > twoWeeksPast)
		// To allow time for pdfs to be uploaded by Oireachtas
		date_end = dateToYMDstring(new Date(twoWeeksPast));

	console.log(`Records to be processed between ${date_start} and ${date_end}`);
	console.log('Fetching and formatting debate records . . .');

	const formattedCommitteeDebates: Promise<CommitteeDebateRecord[]> =
		fetchDebates({
			date_start: date_start,
			date_end: date_end,
			chamber_type: 'committee',
		}) as Promise<CommitteeDebateRecord[]>;

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
