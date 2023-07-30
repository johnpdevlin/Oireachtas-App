/** @format */

import formatCommitteeDebates from '@/Functions/API-Calls/OireachtasAPI/Format/committeeDebates';
import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import { CommitteeDebateRecord } from '@/Models/OireachtasAPI/debate';
import { bindReportsToDebateRecords } from './bindReports2DebateRecords';
import getAllCommitteeInfo from '../ScrapeInfo/scapePageInfo';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { RawFormattedMember, RawMember } from '@/Models/OireachtasAPI/member';
import { CommitteeAttendance } from '@/Models/committee';

// Fetches from Orieachtas API: debates, members
// Scrapes base committee info
// Passes above for processing
// Verifies attendance which cross references against above
// and with additional scrapes called within called functions
export default async function processCommitteeReportsBetweenDates(
	date_start: string,
	date_end: string
): Promise<CommitteeAttendance[]> {
	console.log(`Records to be processed between ${date_start} and ${date_end}`);
	console.log('Fetching and formatting debate records');

	const formattedCommitteeDebates: Promise<CommitteeDebateRecord[]> =
		fetchDebates(
			{
				date_start: date_start,
				date_end: date_end,
				chamber_type: 'committee',
			},
			formatCommitteeDebates
		) as Promise<CommitteeDebateRecord[]>;

	const baseCommittees = (await getAllCommitteeInfo()).map((bc) => {
		return { ...bc, records: [] };
	});

	const allMembers = (await fetchMembers({
		date_start: date_start,
		date_end: date_end,
	})) as RawFormattedMember[];

	const processedAttendanceRecords = await bindReportsToDebateRecords(
		await formattedCommitteeDebates,
		baseCommittees,
		allMembers
	);

	return processedAttendanceRecords;
}
