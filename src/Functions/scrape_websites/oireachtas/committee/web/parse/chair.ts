/** @format */

import { RawMember } from '@/models/oireachtasApi/member';
import { MemberBaseKeys, BinaryChamber, MemberURI } from '@/models/_utils';
import { CheerioAPI } from 'cheerio';
import { getHouseCode } from './house_code';

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
				?.replace('/', '') as MemberURI;
			const memberDetails = allMembers.find(
				(member) => member.memberCode === uri
			);
			const houseCode = getHouseCode(
				memberDetails!.memberships,
				excpDate ? excpDate : undefined
			) as BinaryChamber;
			chair = { houseCode, uri, name };
		}
	});
	return chair;
}
