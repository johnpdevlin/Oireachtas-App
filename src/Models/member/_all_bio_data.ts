/** @format */

import { WikiMemberProfileDetails, WikiPosition } from './wiki_profile';
import { MemberAPIdetails } from '../oireachtas_api/Formatted/Member/member';
import { MemberOirProfileData } from './oir_profile';
import { MemberConstituency } from '../oireachtas_api/Formatted/Member/constituency';

export type Gender = 'male' | 'female';

export type AllMemberBioData = {
	gender: Gender | undefined;
} & MemberOirProfileData &
	Omit<WikiMemberProfileDetails, 'positions'> &
	Omit<MemberAPIdetails, 'constituencies'> & {
		constituencies: {
			dail: MemberConstituency[];
			seanad: MemberConstituency[];
			other: WikiPosition[];
		};
	} & { partyPositions?: WikiPosition[]; otherPositions?: WikiPosition[] };
