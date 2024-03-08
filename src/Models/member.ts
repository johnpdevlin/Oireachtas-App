/** @format */
import { DateRangeStr } from '@/models/dates';
import { MemberCommittee } from './oireachtasApi/Formatted/Member/committee';
import { MemberOirProfile } from '@/functions/oireachtas_pages/td/profile/td_profile';

export type OirData = MemberOirProfile & {
	committees: { current?: MemberCommittee[]; past?: MemberCommittee[] };
};

export type MemberParty = {
	name: string;
	uri: string;
	dateRange: DateRangeStr;
};
