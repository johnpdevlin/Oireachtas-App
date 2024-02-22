/** @format */

import processCommitteeReportsBetweenDates from '../report/_committee_attendance';
import { dateToYMDstring, getDateTwoWeeksAgo } from '@/functions/_utils/dates';
import {
	CommitteeAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/committee';
import { aggregateMemberAttendance } from './agggregate/overrall';
import { aggregateMemberCommAttendance } from './agggregate/committee';

async function getMemberCommitteeAttendanceRecords(
	house_no: number,
	date_start: string,
	date_end?: string
): Promise<{
	committee: MemberIndCommAttendanceRecord[];
	overall: CommitteeAttendanceRecord[];
}> {
	console.info(
		'Processing committee report to return aggregated member committee attendance records for each year'
	);
	// variable to allow for time for oir records to be available
	const adjustedDateEnd = adjustDateEnd(date_end);

	const records = await processCommitteeReportsBetweenDates(
		house_no,
		date_start,
		adjustedDateEnd
	);

	// Aggregated committee record for each member by year (linked to house_no)
	const memberCommAttendance = aggregateMemberCommAttendance(records);
	const memberAttendance = aggregateMemberAttendance(memberCommAttendance);

	console.info({ committee: memberCommAttendance, overall: memberAttendance });
	return { committee: memberCommAttendance, overall: memberAttendance };
}

function adjustDateEnd(date_end?: string): string {
	const twoWeeksPast = getDateTwoWeeksAgo();
	if (!date_end || new Date(date_end).getTime() > twoWeeksPast) {
		return dateToYMDstring(new Date(twoWeeksPast));
	}
	return date_end;
}

export { getMemberCommitteeAttendanceRecords };
