/** @format */
import { BinaryChamber } from '@/models/_utils';
import { processSittingReportsByTerm } from './report/_house_attendance';
import { getPossibleSittingDates } from './_utils/get_possible_sitting_dates';
import { getMemberHouseAttendanceRecord } from './member_records/_attendance_record';
import fetchMembers from '@/functions/APIs/Oireachtas/member/raw/_member_details';
import { aggregateMembershipAttendanceRecords } from '../_utils/aggregate_records/_constits+parties';
import { aggregateAllMembersAttendanceRecords } from '../_utils/aggregate_records/_all_members';

async function processHouseAttendanceByTerm(
	chamber: BinaryChamber,
	house_no: number
) {
	const members = await fetchMembers({ chamber, house_no });

	const sittingReports = await processSittingReportsByTerm(chamber, house_no);
	const possibleSittingDates = getPossibleSittingDates(sittingReports);

	const ind_member_records = sittingReports.map((sr) =>
		getMemberHouseAttendanceRecord(sr, possibleSittingDates)
	);

	const membership_records = await aggregateMembershipAttendanceRecords(
		ind_member_records,
		members!
	);

	const all_members = aggregateAllMembersAttendanceRecords(
		house_no.toString(),
		ind_member_records,
		members!
	);

	return {
		possibleSittingDates,
		records: {
			ind_member_records,
			all_members,
			membership_records,
			...all_members,
		},
	};
}

export { processHouseAttendanceByTerm };
