/** @format */

import fetchHouses from '@/functions/APIs/Oireachtas/house/_index';
import fetchMembers from '@/functions/APIs/Oireachtas/member/raw/_member_details';
import { dateToYMDstring } from '@/functions/_utils/dates';
import { RawMember } from '@/models/oireachtasApi/member';

async function getAllRawMembers(house_no: number): Promise<RawMember[]> {
	// Get house for date references
	const house = (await fetchHouses({})).find(
		(h) => h.houseType === 'dail' && Number(h.houseNo) === Number(house_no)
	);
	const { start, end } = house!.dateRange;

	// Fetch members for comparison for non-members of given committee but who are present
	const allMembers = (await fetchMembers({
		date_start: dateToYMDstring(new Date(start)),
		...(end && { date_end: dateToYMDstring(new Date(end)) }),
	})) as RawMember[];

	return allMembers;
}

function filterMembersByHouse(members: RawMember[]) {
	const dailMembers = members.filter(
		(mem) => mem.memberships[0].membership.house.houseCode === 'dail'
	);
	const seanadMembers = members.filter(
		(mem) => mem.memberships[0].membership.house.houseCode === 'seanad'
	);
	return { dail: dailMembers, seanad: seanadMembers };
}

export { getAllRawMembers, filterMembersByHouse };
