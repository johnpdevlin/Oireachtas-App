/** @format */

import { MemberOirProfileData } from '@/models/member/oir_profile';
import getMultiMembersOirDetails from './profile/multi_td_profiles';
import fetchMembers from '@/functions/APIs/Oireachtas/member/raw/_member_details';
import houseDetails from '@/Data/house-details';

export default async function getAllMembersOirData(
	uris?: string[]
): Promise<MemberOirProfileData[]> {
	console.info('Scraping all data from Oireachtas profile for members...');
	if (!uris)
		uris = (
			await fetchMembers({
				chamber: 'dail',
				house_no: houseDetails.dail.current,
			})
		)?.map((member) => member.memberCode) as string[];

	const oirData = await getMultiMembersOirDetails(uris);

	return oirData!;
}
