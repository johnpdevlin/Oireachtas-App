/** @format */

import { removeDuplicateObjects } from '@/Functions/Util/arrays';
import { RawMember, RawOuterMembership } from '@/Models/OireachtasAPI/member';
import { MemberBaseKeys, BinaryChamber } from '@/Models/_utility';
import { PastCommitteeMember, CommitteeMembers } from '@/Models/committee';
import { CheerioAPI } from 'cheerio';

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
			.trim() as string;
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
			name,
			uri,
			houseCode,
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

// Parses memberships to find relevant housecode
export function getHouseCode(
	memberships: RawOuterMembership[],
	date_start?: Date,
	date_end?: Date,
	excpDate?: Date
): BinaryChamber | undefined {
	let relevantMembership:
		| { houseCode: BinaryChamber; endDate: number | null }
		| undefined;

	const ms = memberships.map((mem: RawOuterMembership) => {
		return mem.membership;
	});
	ms?.forEach((membership) => {
		if (ms.length === 1) {
			relevantMembership = {
				houseCode: membership.house.houseCode,
				endDate: null,
			};
		} else {
			const endDate = membership.dateRange.end!
				? new Date(membership.dateRange.end).getTime()
				: null;

			if (relevantMembership?.endDate !== null) {
				if (
					date_start &&
					date_end &&
					endDate! &&
					date_start?.getTime() >=
						new Date(membership.dateRange.start).getTime() &&
					date_end?.getTime() <= endDate
				) {
					// Deals with past members
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (!excpDate && endDate === null) {
					// If no excpetions and endDate is 0 (undefined)
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (
					!relevantMembership ||
					endDate! > relevantMembership.endDate!
				) {
					if (!excpDate || excpDate.getTime() > endDate!) {
						relevantMembership = {
							houseCode: membership.house.houseCode,
							endDate: endDate,
						};
					}
				}
			}
		}
	});

	return relevantMembership?.houseCode;
}

// Extract the chair
export function getChair(
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
				?.replace('/', '') as string;
			const memberDetails = allMembers.find(
				(member) => member.memberCode === uri
			);
			const houseCode = getHouseCode(
				memberDetails!.memberships,
				excpDate ? excpDate : undefined
			) as BinaryChamber;
			chair = { name, uri, houseCode };
		}
	});
	return chair;
}

// Extract past committee members from the committee page.
export function getPastMembers(
	$: CheerioAPI,
	allMembers: RawMember[]
): { dail?: PastCommitteeMember[]; seanad?: PastCommitteeMember[] } {
	const dailMembers: PastCommitteeMember[] = [];
	const seanadMembers: PastCommitteeMember[] = [];
	$('.member_box_bottom-history.current-print').each((_index, element) => {
		const name = $(element).find('.committee_member_link').text().trim();
		if (name.length === 0) return;

		const uri = $(element)
			.find('.committee_member_link')
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as string;

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
			name,
			uri,
			dateRange: { date_start, date_end },
			houseCode,
		};

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
	members: PastCommitteeMember[],
	uri: string,
	date_end: Date
): Boolean {
	if (
		members.some(
			(sm) =>
				sm.uri === uri &&
				sm.dateRange.date_end.getFullYear() === date_end.getFullYear() &&
				!(Math.abs(sm.dateRange.date_end.getMonth() - date_end.getMonth()) >= 1)
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
