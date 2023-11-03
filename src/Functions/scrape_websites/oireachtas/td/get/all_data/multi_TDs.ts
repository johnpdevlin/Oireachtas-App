/** @format */

import { MemberURI } from '@/models/_utils';
import getAllMembersFromCommittees from '../committees/all_memberships';
import getMultiMembersAPIdetails from '../profile/multi_td_profiles';
import bindCommittees2Members from '../../bind/committees2TDs';
import { OirData } from '@/models/scraped/oireachtas/member';

export default async function getAllMembersOirData(
	uris: MemberURI[]
): Promise<OirData[]> {
	const oirData = await getMultiMembersAPIdetails(uris);
	const { current, past } = await getAllMembersFromCommittees();

	const mergedData = bindCommittees2Members(
		current,
		past,
		oirData!
	) as OirData[];

	return mergedData;
}
