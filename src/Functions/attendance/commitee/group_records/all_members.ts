/** @format */

import {
	CommitteeAttendanceRecord,
	GroupCommitteeAttendanceRecord,
} from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';
import { aggregateMemberAttendance } from './_utils/aggregate_attendance';
import { filterMemberCommitteeRecordsByHouse } from './_utils/filter_by_house';

function aggregateAllMembersAttendanceRecords(
	house_no: string,
	records: CommitteeAttendanceRecord[],
	allMembers: RawMember[]
): {
	dail: GroupCommitteeAttendanceRecord[];
	seanad: GroupCommitteeAttendanceRecord[];
} {
	const dail_no = house_no;
	const seanad_no = (Number(house_no) - 7).toString();
	const { dail, seanad } = filterMemberCommitteeRecordsByHouse(
		records,
		allMembers
	);

	const processedDail = aggregateMemberAttendance(
		'dail',
		dail_no,
		dail,
		allMembers
	);
	const processedSeanad = aggregateMemberAttendance(
		'seanad',
		seanad_no,
		seanad,
		allMembers
	);

	return { dail: processedDail, seanad: processedSeanad };
}

export { aggregateAllMembersAttendanceRecords };
