/** @format */

import { RawMember } from '@/models/oireachtas_api/member';
import { CommitteeAttendance } from '@/models/attendance';
import fetchDebates from '../../../APIs/Oireachtas/debate/_index';
import { bindReportsToDebateRecords } from '@/functions/attendance/commitee/report/process/_bind_reports2debate_records';
import { getDateTwoWeeksAgo, dateToYMDstring } from '@/functions/_utils/dates';
import { CommitteeDebateRecord } from '@/models/oireachtas_api/debate';
import { getAllRawMembers } from '../../../_utils/all_members_by_dail_no';
import { RawCommittee } from '@/models/oireachtas_api/committee';

/** 
	Fetches from Orieachtas API: debates, members
	Verifies attendance which cross references against committee and member
**/
async function processCommitteeReportsBetweenDates(
	house_no: number,
	committees: RawCommittee[],
	allMembers?: RawMember[],
	date_start?: string,
	date_end?: string
): Promise<CommitteeAttendance[]> {
	// variable to allow for time for oir records to be available
	const twoWeeksPast = getDateTwoWeeksAgo();

	if (!date_start || !house_no) return [];
	if (!date_end || new Date(date_end!).getTime() > twoWeeksPast)
		// To allow time for pdfs to be uploaded by Oireachtas
		date_end = dateToYMDstring(new Date(twoWeeksPast));

	if (!allMembers) allMembers = await getAllRawMembers(house_no);

	console.info(`Records to be processed between ${date_start} and ${date_end}`);

	console.info('Fetching and formatting committee debates.');
	const formattedCommitteeDebates: Promise<CommitteeDebateRecord[]> =
		fetchDebates({
			date_start: date_start,
			date_end: date_end,
			chamber_type: 'committee',
		}) as Promise<CommitteeDebateRecord[]>;
	console.info('Fetched and formatted debate records.');

	console.info('Fetched base committee and members details.');

	const processedAttendanceRecords = await bindReportsToDebateRecords(
		await formattedCommitteeDebates,
		committees,
		allMembers
	);

	console.info('All processes completed successfully.');
	return processedAttendanceRecords!;
}

export default processCommitteeReportsBetweenDates;
