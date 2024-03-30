/** @format */

import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';
import getDocFromDB from '../single/[uri]';
import getDocsBatchFromDB from '../multiple/batch';
import { GroupType } from '@/models/_utils';
import { MemberCommittee } from '@/models/oireachtasApi/Formatted/Member/committee';
import { MemberPageData } from '@/models/ui/member';
import { AttendanceData } from '@/models/ui/attendance';

export default async function fetchTDpageData(
	uri: string
): Promise<MemberPageData> {
	const bioData = (await getDocFromDB('td', uri)) as unknown as MemberBioData;

	const party = bioData.parties[0].uri;
	const constituency = bioData.constituencies!.dail![0].uri;

	const attendanceData = await getAttendanceData(
		party,
		constituency,
		bioData.committees
	);

	return {
		bio: bioData,
		attendance: attendanceData,
	};
}

const getAttendanceData = async (
	partyID: string,
	constitID: string,
	committees: { current: MemberCommittee[]; past: MemberCommittee[] }
): Promise<AttendanceData> => {
	const dail = { group_type: 'dail', id: 'dail' };
	const party = {
		group_type: 'party',
		id: partyID,
	};
	const constituency = {
		group_type: 'constituency',
		id: constitID,
	};
	const comms = [...committees.current, ...committees.past].map((com) => {
		return { group_type: 'committee', id: com.uri };
	}) as { group_type: GroupType; id: string }[];

	const params = [party, constituency, dail] as {
		group_type: GroupType;
		id: string;
	}[];
	const houseAttendance = await getDocsBatchFromDB('house-attendance', params);
	const committeeAttendance = await getDocsBatchFromDB('committee-attendance', [
		...params,
		// ...comms,
	]);
	return {
		house: houseAttendance,
		committee: committeeAttendance,
	} as AttendanceData;
};
