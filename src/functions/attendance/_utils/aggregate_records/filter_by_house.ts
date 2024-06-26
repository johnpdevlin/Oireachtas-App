/** @format */

import { filterMembersByHouse } from '@/functions/_utils/all_members_by_dail_no';
import { AttendanceRecord } from '@/models/attendance';
import { RawMember } from '@/models/oireachtas_api/member';

function filterMemberCommitteeRecordsByHouse(
	records: AttendanceRecord[],
	members: RawMember[]
) {
	const { dail, seanad } = filterMembersByHouse(members);

	const dailRecords = records.filter((record) =>
		dail.find((dr) => dr.memberCode === record.uri)
	);
	const seanadRecords = records.filter((record) =>
		seanad.find((sr) => sr.memberCode === record.uri)
	);
	return { dail: dailRecords, seanad: seanadRecords };
}

export { filterMemberCommitteeRecordsByHouse };
