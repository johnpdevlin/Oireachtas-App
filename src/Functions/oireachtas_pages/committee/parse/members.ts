/** @format */

import { removeDuplicateObjects } from '@/functions/_utils/arrays';
import { RawMember } from '@/models/oireachtasApi/member';
import { MemberBaseKeys, BinaryChamber, MemberURI } from '@/models/_utils';
import { CommitteeMember, CommitteeMembers } from '@/models/committee';
import { CheerioAPI } from 'cheerio';
import { getHouseCode } from './house_code';

// Extract member URIs and houseCodes from the committee page.
export function getMembers(
	$: CheerioAPI,
	allMembers: RawMember[],
	excpDate?: Date
): { dail?: MemberBaseKeys[]; seanad?: MemberBaseKeys[] } {
	const dailMembers: MemberBaseKeys[] = [];
	const seanadMembers: MemberBaseKeys[] = [];
	$('.committee_member_link').each((_index, element) => {
		const name = $(element).text().trim();
		const uri = $(element)
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as MemberURI;
		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);

		if (!name || !uri) return;

		// Find Member's houseCode and push to that array
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			excpDate ? excpDate : undefined
		) as BinaryChamber;
		const memberObj = {
			houseCode,
			uri,
			name,
		};

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

// Extract past committee members from the committee page.
export function getPastMembers(
	$: CheerioAPI,
	allMembers: RawMember[]
): { dail?: CommitteeMember[]; seanad?: CommitteeMember[] } {
	const dailMembers: CommitteeMember[] = [];
	const seanadMembers: CommitteeMember[] = [];
	$('.member_box_bottom-history.current-print').each((_index, element) => {
		const name = $(element).find('.committee_member_link').text().trim();
		if (name.length === 0) return;

		const uri = $(element)
			.find('.committee_member_link')
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as MemberURI;

		// Format Dates
		const dateText = $(element).find('p > i').text().trim();
		const [startMonth, startYear, endMonth, endYear] = dateText
			.split('-')
			.map((str) => str.trim());
		const date_start = new Date(`${startYear}-${startMonth}-01`);
		const date_end = new Date(`${endYear}-${endMonth}-01`);

		if (!date_start.getTime() || !date_end.getTime()) {
			console.log(dateText);
		}

		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			date_start,
			date_end
		) as BinaryChamber;

		const memberObj = {
			name: name,
			uri: uri,
			houseCode: houseCode,
			dateRange: {
				start: `${startYear}-${startMonth}-01`,
				end: `${endYear}-${endMonth}-01`,
			},
		} as CommitteeMember;

		if (
			houseCode === 'seanad' &&
			(!seanadMembers || !checkForPastDuplicates(seanadMembers, uri, date_end))
		) {
			seanadMembers.push(memberObj);
		} else if (
			houseCode === 'dail' &&
			(!dailMembers || !checkForPastDuplicates(dailMembers, uri, date_end))
		) {
			dailMembers.push(memberObj);
		}
	});

	return {
		...(dailMembers.length > 0 && {
			dail: dailMembers,
		}),
		...(seanadMembers.length > 0 && {
			seanad: seanadMembers,
		}),
	};
}

export function checkForPastDuplicates(
	members: CommitteeMember[],
	uri: string,
	date_end: Date
): Boolean {
	if (
		members.some(
			(sm) =>
				sm.uri === uri &&
				new Date(sm.dateRange.end!).getFullYear() === date_end.getFullYear() &&
				!(
					Math.abs(
						new Date(sm.dateRange.end!).getMonth() - date_end.getMonth()
					) >= 1
				)
		)
	) {
		return true;
	}
	return false;
}

// Remove past members from the array of current members.
export function removePastMembers(
	members: CommitteeMembers,
	pastMembers: CommitteeMembers
): CommitteeMembers {
	let dailMembers;
	let seanadMembers;

	if (members.dail && pastMembers.dail) {
		dailMembers = members.dail.filter(
			(x) => !pastMembers.dail?.some((y) => y.uri === x.uri)
		);
	}
	if (members.seanad && pastMembers.seanad) {
		seanadMembers = members.seanad.filter(
			(x) => !pastMembers.seanad?.some((y) => y.uri === x.uri)
		);
	}
	return {
		...(dailMembers!
			? {
					dail: dailMembers,
			  }
			: { dail: members.dail }),
		...(seanadMembers!
			? {
					seanad: seanadMembers,
			  }
			: { seanad: members.seanad }),
	};
}
