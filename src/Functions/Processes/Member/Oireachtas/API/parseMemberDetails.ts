/** @format */
import checkGender from '@/Functions/API-Calls/IrishNamesAPI';
import fetcher from '@/Functions/API-Calls/fetcher';
import parseMemberships from './Parse/Memberships/_index';
import { MemberConstituency } from '@/Models/DB/Member/constituency';
import { MemberOffice } from '@/Models/DB/Member/office';
import { MemberParty } from '@/Models/DB/Member/party';

export type MemberAPIdetailsResponse = {
	uri: string;
	fullName: string;
	firstName: string;
	lastName: string;
	dateOfDeath?: string | undefined;
	gender: string | undefined;
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

export default async function parseMemberDetails(
	uri: string,
	boyNames?: Record<number, string>,
	girlNames?: Record<number, string>
): Promise<MemberAPIdetailsResponse | void> {
	try {
		const response = await fetcher(
			`https://api.oireachtas.ie/v1/members?member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${uri}`
		);

		const member = response.results[0].member;
		const fullName = member.fullName;
		const firstName = member.firstName;
		const lastName = member.lastName;
		const dateOfDeath = member.dateOfDeath;

		const findGender = async () => {
			const result = await checkGender(firstName, boyNames, girlNames);
			if (!result) return undefined;
			else return result;
		};

		const gender = await findGender();
		const memberships = parseMemberships(member.memberships);

		return {
			uri,
			fullName,
			firstName,
			lastName,
			dateOfDeath,
			gender,
			...memberships,
		};
	} catch (err) {
		console.log(err);
	}
}
