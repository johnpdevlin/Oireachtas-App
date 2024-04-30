/** @format */

import { MemberCommittee } from '@/models/oireachtas_api/Formatted/Member/committee';
import { MemberConstituency } from '@/models/oireachtas_api/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtas_api/Formatted/Member/office';
import { MemberParty } from '@/models/oireachtas_api/Formatted/Member/party';

export type MemberAPIdetails = {
	uri: string;
	fullName: string;
	firstName: string;
	lastName: string;
	dateOfDeath?: string | undefined | null;
	constituencies: {
		dail?: MemberConstituency[];
		seanad?: MemberConstituency[];
	};
	isActiveSenator: boolean;
	isActiveTD: boolean;
	parties: MemberParty[];
	offices?: MemberOffice[];
	committees: { current: MemberCommittee[]; past: MemberCommittee[] };
	isActiveSeniorMinister: boolean;
	isActiveJuniorMinister: boolean;
};
