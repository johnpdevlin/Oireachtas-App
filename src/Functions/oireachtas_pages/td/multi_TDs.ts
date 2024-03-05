/** @format */

import getMultiMembersOirDetails from './profile/multi_td_profiles';

import { MemberOirProfile } from './profile/td_profile';

export default async function getAllMembersOirData(
	uris: string[]
): Promise<MemberOirProfile[]> {
	const oirData = await getMultiMembersOirDetails(uris);

	return oirData!;
}
