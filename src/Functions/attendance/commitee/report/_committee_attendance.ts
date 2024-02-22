/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeAttendance } from '@/models/committee';
import fetchDebates from '../../../APIs/Oireachtas/debate/_index';
import processAllCommitteeInfo from '@/functions/oireachtas_pages/committee/_all_committees_info';
import { bindReportsToDebateRecords } from '@/functions/attendance/commitee/report/process/_bind_reports2debate_records';
import { getDateTwoWeeksAgo, dateToYMDstring } from '@/functions/_utils/dates';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';

import { getAllMembers } from '../../../_utils/all_members_by_dail_no';

/** 
	Fetches from Orieachtas API: debates, members
	Scrapes base committee info
	Passes above for processing
	Verifies attendance which cross references against above
	and with additional scrapes called within called functions 
**/
async function processCommitteeReportsBetweenDates(
	house_no: number,
	date_start: string,
	date_end?: string,
	allMembers?: RawMember[]
): Promise<CommitteeAttendance[]> {
	// variable to allow for time for oir records to be available
	const twoWeeksPast = getDateTwoWeeksAgo();

	if (!date_start || !house_no) return [];
	if (!date_end || new Date(date_end!).getTime() > twoWeeksPast)
		// To allow time for pdfs to be uploaded by Oireachtas
		date_end = dateToYMDstring(new Date(twoWeeksPast));

	console.log(`Records to be processed between ${date_start} and ${date_end}`);

	const formattedCommitteeDebates: Promise<CommitteeDebateRecord[]> =
		fetchDebates({
			date_start: date_start,
			date_end: date_end,
			chamber_type: 'committee',
		}) as Promise<CommitteeDebateRecord[]>;
	console.info('Fetched and formatted debate records.');

	const baseCommittees = (await processAllCommitteeInfo()).map((bc) => {
		return { ...bc, records: [] };
	});

	// Members as reference for non-members of committees
	if (!allMembers) {
		allMembers = await getAllMembers(house_no);
	}
	console.info('Fetched base committee and members details.');

	const processedAttendanceRecords = await bindReportsToDebateRecords(
		await formattedCommitteeDebates,
		baseCommittees,
		allMembers
	);
	console.info('All processes completed successfully.');
	console.info(processedAttendanceRecords);
	return processedAttendanceRecords;
}

export default processCommitteeReportsBetweenDates;
