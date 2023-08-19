/** @format */

import { MemberConstituency } from '@/Models/OireachtasAPI/Formatted/Member/constituency';
import { MemberOffice } from '@/Models/OireachtasAPI/Formatted/Member/office';
import { MemberParty } from '@/Models/DB/Member/party';
import { MemberURI } from '@/Models/_util';

export type MemberAPIdetails = {
	uri: MemberURI;
	fullName: string;
	firstName: string;
	lastName: string;
	dateOfDeath?: string | undefined;
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
