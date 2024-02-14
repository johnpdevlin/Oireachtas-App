/** @format */

import { strMonthToNumber } from '@/functions/_utils/dates';
import { BinaryChamber } from '@/models/_utils';
import { CommitteeMember, CommitteeMembers } from '@/models/committee';
import { DateRangeObj } from '@/models/dates';
import { RawMember } from '@/models/oireachtasApi/member';
import { CheerioAPI } from 'cheerio';
import { getHouseCode } from '../house_code';

// Extract past committee members from the committee page.
export function getPastMembers(
	$: CheerioAPI,
	allMembers: RawMember[],
	dateRange: DateRangeObj
): { dail: CommitteeMember[]; seanad: CommitteeMember[] } {
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
			.trim();

		// Format Dates
		const dateText = $(element).find('p > i').text().trim();
		const { startDate, endDate } = formatMemberDates(dateText, dateRange);

		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			startDate,
			endDate
		) as BinaryChamber;

		const memberObj = {
			name: name,
			uri: uri,
			house_code: houseCode,
			dateRange: {
				start: startDate,
				end: endDate,
			},
		} as CommitteeMember;

		if (
			houseCode === 'seanad' &&
			(!seanadMembers || !checkForPastDuplicates(seanadMembers, uri!, endDate))
		) {
			seanadMembers.push(memberObj);
		} else if (
			houseCode === 'dail' &&
			(!dailMembers || !checkForPastDuplicates(dailMembers, uri!, endDate))
		) {
			dailMembers.push(memberObj);
		}
	});

	return {
		dail: dailMembers ? dailMembers : [],
		seanad: seanadMembers ? seanadMembers : [],
	};
}

function formatMemberDates(
	dateText: string,
	dateRange: DateRangeObj
): {
	startDate: Date;
	endDate: Date;
} {
	// split to find start and date strings
	const [start, end] = dateText
		.split('-')
		.map((part) => part.trim().split(' '));

	let startDate = new Date(`${start[1]}-${strMonthToNumber(start[0])! + 1}-28`);
	let endDate = new Date(`${end[1]}-${strMonthToNumber(end[0])! + 1}-01`);

	if (
		startDate.getMonth() === dateRange.start.getMonth() &&
		startDate.getFullYear() === dateRange.start?.getFullYear()
	) {
		startDate = dateRange.start;
	}
	if (
		endDate.getMonth() === dateRange?.end?.getMonth() &&
		endDate.getFullYear() === dateRange.end?.getFullYear()
	) {
		endDate = dateRange.end;
	}

	return { startDate, endDate };
}

export function checkForPastDuplicates(
	members: CommitteeMember[],
	uri: string,
	date_end: Date
): boolean {
	return members.some(
		(member) =>
			member.uri === uri &&
			new Date(member.dateRange.end!).getFullYear() ===
				date_end.getFullYear() &&
			Math.abs(
				new Date(member.dateRange.end!).getMonth() - date_end.getMonth()
			) < 1
	);
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
		dail: dailMembers ? dailMembers : [],
		seanad: seanadMembers ? seanadMembers : [],
	};
}
