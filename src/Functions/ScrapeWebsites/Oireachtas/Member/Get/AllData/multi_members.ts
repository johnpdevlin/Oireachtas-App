/** @format */

import { MemberURI } from '@/Models/_util';
import getAllMembersFromCommittees from '../Committees/all_memberships';
import getMultiMembersAPIdetails from '../Profile/multi_memberProfiles';
import bindCommittees2Members from '../../Bind/Committees2Members';
import { OirData } from '@/Models/Scraped/Oireachtas/member';

export default async function getAllMembersOirData(
	uris: MemberURI[]
): Promise<OirData[]> {
	const oirData = await getMultiMembersAPIdetails(uris);
	const { current, past } = await getAllMembersFromCommittees();
	console.log(past);
	const mergedData = bindCommittees2Members(
		current,
		past,
		oirData!
	) as OirData[];

	return mergedData;
}
