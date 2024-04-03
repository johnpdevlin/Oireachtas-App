/** @format */

import getDocFromDB from '../single/[uri]';
import getDocsBatchFromDB from '../multiple/batch';
import { GroupType } from '@/models/_utils';
import { MemberBioData, MemberPageData } from '@/models/ui/member';
import { AttendanceData } from '@/models/ui/attendance';
import { AttendanceRecord } from '@/models/attendance';

export default async function fetchTDpageData(
	uri: string
): Promise<MemberPageData> {
	const bioData = (await getDocFromDB('td', uri)) as unknown as MemberBioData;

	const party = bioData.parties[0].uri;
	const constituency = bioData.constituencies!.dail![0].uri;

	const attendanceData = await getAttendanceData(uri, party, constituency);

	return {
		bio: bioData,
		attendance: attendanceData,
	};
}

const getAttendanceData = async (
	memberID: string,
	partyID: string,
	constitID: string
): Promise<AttendanceData> => {
	const member = { group_type: 'member', id: memberID };
	const dail = { group_type: 'dail', id: 'dail' };
	const party = {
		group_type: 'party',
		id: partyID,
	};
	const constituency = {
		group_type: 'constituency',
		id: constitID,
	};

	const params = [member, party, constituency, dail] as {
		group_type: GroupType;
		id: string;
	}[];
	const houseAttendance = await getDocsBatchFromDB('house-attendance', params);
	const committeeAttendance = await fetchCommitteeAttendance(params);

	return {
		house: houseAttendance,
		committee: committeeAttendance,
	} as AttendanceData;
};

async function fetchCommitteeAttendance(
	params: { group_type: GroupType; id: string }[]
): Promise<Record<GroupType, AttendanceRecord[]>> {
	const committeeAttendance = (await getDocsBatchFromDB(
		'committee-attendance',
		params
	)) as Record<GroupType, AttendanceRecord[]>;

	// Filter out committee records related to members
	committeeAttendance.member = committeeAttendance.member.filter((com) =>
		com.record_uri.startsWith('member')
	);

	return committeeAttendance;
}
