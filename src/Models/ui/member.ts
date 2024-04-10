/** @format */

import { MemberOirProfile } from '@/functions/oireachtas_pages/td/profile/td_profile';
import { MemberAPIdetails } from '../oireachtasApi/Formatted/Member/member';
import { WikiTDProfileDetails } from '../wiki_td';
import { AttendanceData } from './attendance';

// Consolidated Member Bio Data
export type MemberBioData = { gender: string | void } & MemberOirProfile &
	WikiTDProfileDetails &
	MemberAPIdetails & { created?: string };

export type MemberPageData = {
	bio: MemberBioData;
	attendance: AttendanceData;
};
