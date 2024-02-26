/** @format */

import { getAllRawMembers } from '@/functions/_utils/all_members_by_dail_no';
import processCommitteeReportsBetweenDates from './report/_committee_attendance';
import { getMemberCommitteeAttendanceRecords } from './member_records/_member_attendance_records';
import { aggregateCommitteeAttendanceRecords } from './group_records/committees';
import { aggregateMembershipAttendanceRecords } from './group_records/constits+parties';
import { dateToYMDstring, getDateTwoWeeksAgo } from '@/functions/_utils/dates';
import { aggregateAllMembersAttendanceRecords } from './group_records/all_members';

async function processCommitteeAttendanceBetweenDates(
	house_no: number,
	date_start: string,
	date_end: string
) {
	const adjustedDateEnd = adjustDateEnd(date_end);

	const allMembers = await getAllRawMembers(house_no);
	const records = await processCommitteeReportsBetweenDates(
		house_no,
		date_start,
		adjustedDateEnd,
		allMembers
	);

	const memberRecords = await getMemberCommitteeAttendanceRecords(
		house_no,
		date_start,
		adjustedDateEnd,
		records,
		allMembers
	);

	const { member_committee_record, member_ind_overall } = memberRecords;

	// Aggregated record for all members
	const aggregatedAllMembers = aggregateAllMembersAttendanceRecords(
		house_no.toString(),
		member_ind_overall,
		allMembers
	);

	const aggregatedByCommittee = aggregateCommitteeAttendanceRecords(records);

	const aggregatedByMembership = await aggregateMembershipAttendanceRecords(
		member_ind_overall,
		allMembers
	);

	console.info({
		all_members: aggregatedAllMembers,
		ind_member: member_ind_overall,
		committees: aggregatedByCommittee,
		memberships: aggregatedByMembership,
	});

	return {
		all_members: aggregatedAllMembers,
		ind_member: member_ind_overall,
		committees: aggregatedByCommittee,
		memberships: aggregatedByMembership,
	};
}
function adjustDateEnd(date_end?: string): string {
	const twoWeeksPast = getDateTwoWeeksAgo();
	if (!date_end || new Date(date_end).getTime() > twoWeeksPast) {
		return dateToYMDstring(new Date(twoWeeksPast));
	}
	return date_end;
}

export { processCommitteeAttendanceBetweenDates };