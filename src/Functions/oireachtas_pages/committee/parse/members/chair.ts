/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { MemberBaseKeys, BinaryChamber } from '@/models/_utils';
import { CheerioAPI } from 'cheerio';
import { getHouseCode } from '../house_code';

// Extract the chair
export default function getChair(
	$: CheerioAPI,
	allMembers: RawMember[],
	excpDate?: Date
): MemberBaseKeys | undefined {
	let chair: MemberBaseKeys | undefined;
	$('.member_box').each((_index, element) => {
		if ($(element).find('.committee_member_chair').length > 0) {
			const name = $(element).find('.committee_member_link').text().trim();
			const uri = $(element)
				.find('.committee_member_link')
				.attr('href')
				?.split('r/')[1]
				?.replace('/', '')!;
			const memberDetails = allMembers.find(
				(member) => member.memberCode === uri
			);
			const house_code = getHouseCode(
				memberDetails!.memberships,
				excpDate ? excpDate : undefined
			) as BinaryChamber;
			chair = { house_code, uri, name };
		}
	});
	return chair;
}
