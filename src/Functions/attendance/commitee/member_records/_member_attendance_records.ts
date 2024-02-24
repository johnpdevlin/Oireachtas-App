/** @format */

import processCommitteeReportsBetweenDates from '../report/_committee_attendance';
import {
	CommitteeAttendance,
	CommitteeAttendanceRecord,
	GroupCommitteeAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/committee';
import { aggregateMemberAttendance } from './agggregate/overrall';
import { aggregateMemberCommAttendance } from './agggregate/committee';
import { getAllRawMembers } from '@/functions/_utils/all_members_by_dail_no';
import { aggregateAllMembersAttendanceRecords } from '../group_records/all_members';
import { RawMember } from '@/models/oireachtasApi/member';

// Returns aggreggated records for members
// (individual committee record, overall committee record
// and aggregated records for all members)
async function getMemberCommitteeAttendanceRecords(
	house_no: number,
	date_start: string,
	date_end?: string,
	records?: CommitteeAttendance[],
	allMembers?: RawMember[]
): Promise<{
	member_committee_record: MemberIndCommAttendanceRecord[];
	member_ind_overall: CommitteeAttendanceRecord[];
	all_agg_members: {
		dail: GroupCommitteeAttendanceRecord[];
		seanad: GroupCommitteeAttendanceRecord[];
	};
}> {
	console.info(
		'Processing committee report to return aggregated member committee attendance records for each year'
	);
	if (!allMembers) allMembers = await getAllRawMembers(house_no);

	if (!records)
		records = await processCommitteeReportsBetweenDates(
			house_no,
			date_start,
			date_end,
			allMembers
		);

	// Aggregated committee record for each member by year (linked to house_no)
	const memberCommAttendance = aggregateMemberCommAttendance(records);
	const memberAttendance = aggregateMemberAttendance(memberCommAttendance);

	// Aggregated record for all members
	const allMemRecords = aggregateAllMembersAttendanceRecords(
		house_no.toString(),
		memberAttendance,
		allMembers
	);

	return {
		member_committee_record: memberCommAttendance,
		member_ind_overall: memberAttendance,
		all_agg_members: allMemRecords,
	};
}

export { getMemberCommitteeAttendanceRecords };
