/** @format */

import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';
import { MemberParty } from '@/Models/DB/Member/party';
import { MemberURI } from '@/models/_utils';

export type MemberAPIdetails = {
	uri: MemberURI;
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
