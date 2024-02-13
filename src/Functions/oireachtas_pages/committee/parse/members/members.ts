/** @format */

import { removeDuplicateObjects } from '@/functions/_utils/arrays';
import { RawMember } from '@/models/oireachtasApi/member';
import { MemberBaseKeys, BinaryChamber } from '@/models/_utils';
import { CheerioAPI } from 'cheerio';
import { getHouseCode } from '../house_code';

// Extract member URIs and houseCodes from the committee page.
function getMembers(
	$: CheerioAPI,
	allMembers: RawMember[],
	excpDate?: Date
): { dail?: MemberBaseKeys[]; seanad?: MemberBaseKeys[] } {
	const dailMembers: MemberBaseKeys[] = [];
	const seanadMembers: MemberBaseKeys[] = [];
	$('.committee_member_link').each((_index, element) => {
		const name = $(element).text().trim();

		// extract uri from url
		const uri = $(element)
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim();

		// match member details by uri
		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);

		if (!name || !uri) return;

		// Find Member's houseCode and push to that array
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			excpDate ? excpDate : undefined
		) as BinaryChamber;

		// create member object
		const memberObj = {
			houseCode,
			uri,
			name,
		} as unknown as MemberBaseKeys;

		// assign member to relevant house
		if (houseCode === 'seanad') seanadMembers.push(memberObj);
		else if (houseCode === 'dail') dailMembers.push(memberObj);
	});

	return {
		...(dailMembers?.length > 0 && {
			dail: removeDuplicateObjects(dailMembers),
		}),
		...(seanadMembers?.length > 0 && {
			seanad: removeDuplicateObjects(seanadMembers),
		}),
	};
}

export { getMembers };
