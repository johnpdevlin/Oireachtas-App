/** @format */
import { aggregateMemberAttendance } from './agggregate/overrall';
import { aggregateMemberCommAttendance } from './agggregate/committee';
import { RawMember } from '@/models/oireachtasApi/member';
import {
	AttendanceRecord,
	CommitteeAttendance,
	GroupAttendanceRecord,
	MemberIndCommAttendanceRecord,
} from '@/models/attendance';
import { aggregateAllMembersAttendanceRecords } from '../../_utils/aggregate_records/_all_members';

// Returns aggreggated records for members
// (individual committee record, overall committee record
// and aggregated records for all members)
async function getMemberCommitteeAttendanceRecords(
	house_no: number,
	records: CommitteeAttendance[],
	allMembers: RawMember[]
): Promise<{
	member_committee_record: MemberIndCommAttendanceRecord[];
	member_ind_overall: AttendanceRecord[];
	all_agg_members: {
		dail: GroupAttendanceRecord[];
		seanad: GroupAttendanceRecord[];
	};
}> {
	console.info(
		'Processing committee report to return aggregated member committee attendance records for each year'
	);

	// Aggregated committee record for each member by year (linked to house_no)
	const memberCommAttendance = aggregateMemberCommAttendance(records);

	// Get aggrgegated commitee attendance for each member
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
