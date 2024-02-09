/** @format */

import { groupByNested } from '@/functions/_utils/objects';
import processCommitteeReportsBetweenDates from '../report/_committee_attendance';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import { aggregateMemberAttendance } from './agg_member_records';

async function getMemberCommitteeAttendanceRecords(
	start_date: string,
	end_date: string
) {
	const records = await processCommitteeReportsBetweenDates(
		start_date,
		end_date
	);

	const grouped = groupByURIandYear(records);

	const processed = aggregateMemberAttendance(records);
	console.info(processed);
}

function groupByURIandYear(records: CommitteeDebateRecord[]) {
	return groupByNested<CommitteeDebateRecord>(records, (record) => {
		const year = record.date.getFullYear().toString();
		return [record.uri, year];
	});
}

export { getMemberCommitteeAttendanceRecords };
