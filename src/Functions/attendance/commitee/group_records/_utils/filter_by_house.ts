/** @format */

import { filterMembersByHouse } from '@/functions/_utils/all_members_by_dail_no';
import { CommitteeAttendanceRecord } from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';

function filterMemberCommitteeRecordsByHouse(
	records: CommitteeAttendanceRecord[],
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
