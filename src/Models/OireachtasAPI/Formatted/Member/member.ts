/** @format */

import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';
import { MemberParty } from '@/models/oireachtasApi/Formatted/Member/party';

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
	isActiveSeniorMinister: boolean;
	isActiveJunior: boolean;
};
