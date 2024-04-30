/** @format */
import getDocsBatchFromDB from '../multiple/batch';
import { GroupType } from '@/models/_utils';
import { MemberPageBioData } from '@/models/pages/member/member';
import { AttendanceData } from '@/models/pages/attendance';
import { AttendanceRecord } from '@/models/attendance';
import getDocFromDB from '../single/[uri]';

export default async function fetchTDpageData(uri: string) {
	const bioData = (await getDocFromDB(
		'td',
		uri
	)) as unknown as MemberPageBioData;

	const party = bioData.parties[0].uri! as string;
	const constituency = bioData.constituencies!.dail![0].uri! as string;

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
	const houseAttendance = await fetchAttendanceRecords('house', params);
	const committeeAttendance = await fetchAttendanceRecords('committee', params);

	return {
		house: houseAttendance,
		committee: committeeAttendance,
	} as AttendanceData;
};

async function fetchAttendanceRecords(
	type: 'committee' | 'house',
	params: { group_type: GroupType; id: string }[]
) {
	const records = (await getDocsBatchFromDB(
		`${type}-attendance`,
		params
	)) as Record<GroupType, AttendanceRecord[]>;

	records.member = records.member.filter(
		(rec) => rec.present_percentage?.overall!
	);

	const years = records.member.map((rec) => rec.year);
	// Filter out committee records related to members
	if (type === 'committee')
		records.member = records.member.filter((com) =>
			com.record_uri.startsWith('member')
		);

	for (const key in records) {
		// Filter out unneccessary years for non member records
		if (key !== 'member')
			records[key as GroupType] = records[key as GroupType].filter((rec) =>
				years.includes(rec.year)
			);
	}

	return records;
}
