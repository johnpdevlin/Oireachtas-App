/** @format */

import { WikiMemberProfileDetails } from './wiki_profile';
import { MemberAPIdetails } from '../oireachtas_api/Formatted/Member/member';
import { MemberOirProfileData } from './oir_profile';

export type Gender = 'male' | 'female';

export type AllMemberBioData = {
	gender: Gender | undefined;
} & MemberOirProfileData &
	WikiMemberProfileDetails &
	MemberAPIdetails;
