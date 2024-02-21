/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeAttendance } from '@/models/committee';
import fetchDebates from '../../../APIs/Oireachtas/debate/_index';
import fetchMembers from '../../../APIs/Oireachtas/member/raw/_member_details';
import processAllCommitteeInfo from '@/functions/oireachtas_pages/committee/_all_committees_info';
import { bindReportsToDebateRecords } from '@/functions/attendance/commitee/report/process/_bind_reports2debate_records';
import { getDateTwoWeeksAgo, dateToYMDstring } from '@/functions/_utils/dates';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import fetchHouses from '@/functions/APIs/Oireachtas/house/_index';
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
	date_end?: string
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

	// Members as reference for non-members of committees a
	const allMembers = await getMembers(house_no);

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

async function getMembers(house_no: number): Promise<RawMember[]> {
	// Get house for date references
	const house = (await fetchHouses({})).find(
		(h) => h.houseType === 'dail' && Number(h.houseNo) === Number(house_no)
	);
	const { start, end } = house!.dateRange;

	// Fetch members for comparison for non-members of given committee but who are present
	const allMembers = (await fetchMembers({
		date_start: dateToYMDstring(new Date(start)),
		...(end && { date_end: dateToYMDstring(new Date(end)) }),
	})) as RawMember[];

	return allMembers;
}

export default processCommitteeReportsBetweenDates;
