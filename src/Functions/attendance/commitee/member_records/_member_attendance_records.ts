/** @format */

import { groupByNested } from '@/functions/_utils/objects';
import processCommitteeReportsBetweenDates from '../report/_committee_attendance';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import { aggregateMemberAttendance } from './agg_member_records';
import { getMergedMemberAttRecords } from './merged_member_attendance';
import { dateToYMDstring, getDateTwoWeeksAgo } from '@/functions/_utils/dates';
import { CommitteeAttendanceRecord } from '@/models/committee';

async function getMemberCommitteeAttendanceRecords(
	house_no: number,
	date_start: string,
	date_end?: string
): Promise<CommitteeAttendanceRecord[]> {
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

	const grouped = groupByURIandYear(records);
	console.info(grouped);
	const processed = aggregateMemberAttendance(records);
	const merged = getMergedMemberAttRecords(processed);
	console.info(merged);

	return merged;
}

function groupByURIandYear(records: CommitteeDebateRecord[]) {
	return groupByNested<CommitteeDebateRecord>(records, (record) => {
		const year = record.date.getFullYear().toString();
		return [record.uri, year];
	});
}

function adjustDateEnd(date_end?: string): string {
	const twoWeeksPast = getDateTwoWeeksAgo();
	if (!date_end || new Date(date_end).getTime() > twoWeeksPast) {
		return dateToYMDstring(new Date(twoWeeksPast));
	}
	return date_end;
}

export { getMemberCommitteeAttendanceRecords };
