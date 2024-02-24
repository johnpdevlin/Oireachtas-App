/** @format */

import { filterMembersByHouse } from '@/functions/_utils/all_members_by_dail_no';
import { AttendanceRecord } from '@/models/attendance';
import { RawMember } from '@/models/oireachtasApi/member';

function filterMemberCommitteeRecordsByMembership(
	records: AttendanceRecord[],
	members: RawMember[]
) {
	// handle cases where multiple parties / constits etc.
	const { dail, seanad } = filterMembersByHouse(members);
	const dailRecords = records.filter((record) =>
		dail.find((dr) => dr.memberCode === record.uri)
	);
	const seanadRecords = records.filter((record) =>
		seanad.find((sr) => sr.memberCode === record.uri)
	);
	return { dail: dailRecords, seanad: seanadRecords };
}

export { filterMemberCommitteeRecordsByMembership };
