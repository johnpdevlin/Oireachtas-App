/** @format */

import { MemberOirProfile } from '@/Functions/ScrapeWebsites/Oireachtas/Member/Get/Profile/memberProfile';
import { MemberCommittee } from '../../DB/Member/committee';

export type OirData = MemberOirProfile & {
	committees: { current?: MemberCommittee[]; past?: MemberCommittee[] };
};
