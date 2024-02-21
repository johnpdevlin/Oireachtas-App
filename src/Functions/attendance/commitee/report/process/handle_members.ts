/** @format */

import { MemberBaseKeys, BinaryChamber, CommitteeType } from '@/models/_utils';
import {
	Committee,
	CommitteeMember,
	CommitteeMembers,
} from '@/models/committee';
import { DateRangeObj } from '@/models/dates';
import { RawMember } from '@/models/oireachtasApi/member';

function getMembersAndNonMembers(
	committee: Committee,
	type: CommitteeType,
	allMembers: RawMember[],
	date: Date
):
	| {
			members: MemberBaseKeys[];
			nonMembers: MemberBaseKeys[];
	  }
	| undefined {
	const members: CommitteeMember[] = [];
	let chamber = committee.chamber;
	if (
		committee.members.dail.length > 0 ||
		committee.members.seanad.length > 0
	) {
		const parsed = parseMembers(chamber, type, committee.members);
		members.push(...parsed.members);
		chamber = parsed.chamber;
	}

	if (committee.pastMembers!) {
		const relevantPastMembers = getRelevantPastMembers(
			chamber,
			committee.pastMembers,
			date,
			type
		);

		members.push(...relevantPastMembers);
	}

	const formattedMembers = formatAsBaseKeys(members)!;
	const nonMembers = allMembers
		.filter((am) => formattedMembers.every((com) => com.uri != am.memberCode))
		.map(
			(member) =>
				({
					name: member.fullName,
					uri: member.uri,
					house_code: chamber,
				} as MemberBaseKeys)
		);

	return { members: formattedMembers, nonMembers };
}

// Sorts into current members and non members on given date
function getRelevantPastMembers(
	chamber: BinaryChamber,
	pastMembers: CommitteeMembers,
	date: Date,
	type: CommitteeType
): CommitteeMember[] {
	const parsed = parseMembers(chamber, type, pastMembers).members;
	const relevantMembers = parseRelevantPastMembers(parsed, date);
	if (relevantMembers.length > 0) return relevantMembers;
	else return [];
}

// Get members who were relevant on given date
function parseRelevantPastMembers(
	members: CommitteeMember[],
	date: Date
): CommitteeMember[] {
	return members.filter((member) => isRelevantDate(member.dateRange, date));
}

function isRelevantDate(dr: DateRangeObj, date: Date): boolean {
	// Extract year and month for easier comparison
	const dateYear = date.getFullYear();
	const dateMonth = date.getMonth();
	const startYear = dr.start.getFullYear();
	const startMonth = dr.start.getMonth();
	const endYear = dr.end!.getFullYear();
	const endMonth = dr.end!.getMonth();

	// Check if the date is in the same year and month or later than the start
	const isAfterStart =
		dateYear > startYear || (dateYear === startYear && dateMonth >= startMonth);

	// Check if the date is in the same year and month or before the end
	const isBeforeEnd =
		dateYear < endYear || (dateYear === endYear && dateMonth <= endMonth);

	// The date is relevant if it's after the start and before the end
	return isAfterStart && isBeforeEnd;
}

// Filter out based on committee type
function parseMembers(
	chamber: BinaryChamber,
	type: CommitteeType,
	members: CommitteeMembers
): { chamber: BinaryChamber; members: CommitteeMember[] } {
	const confirmedMembers: CommitteeMember[] = [];
	if (members.dail) confirmedMembers.push(...members.dail);
	if (members.seanad) confirmedMembers.push(...members.seanad);

	if (
		type === 'joint' ||
		!members.dail ||
		type === 'working group' ||
		chamber !== 'dail'
	)
		chamber = 'seanad';

	return {
		chamber: chamber,
		members: confirmedMembers,
	};
}

function formatAsBaseKeys(members: CommitteeMember[]): MemberBaseKeys[] {
	return members.map((com) => {
		return {
			uri: com.uri,
			name: com.name,
			house_code: com.house_code,
		};
	});
}

export { getMembersAndNonMembers };
