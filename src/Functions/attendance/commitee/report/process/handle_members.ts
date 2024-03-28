/** @format */

import { URIpair } from '@/models/_utils';
import { DateRangeStr } from '@/models/dates';
import {
	RawCommittee,
	RawCommitteeMember,
} from '@/models/oireachtasApi/committee';
import { RawMember } from '@/models/oireachtasApi/member';

function getMembersAndNonMembers(
	committee: RawCommittee,
	allMembers: RawMember[],
	date: Date
) {
	const members = formatAsURIpair(
		parseRelevantMembers(committee.members, date)
	);
	const inactiveMembers = formatAsURIpair(
		committee.members.filter((mem) => !members.some((m) => mem.uri === m.uri))
	);
	const nonMembers = formatAsURIpair(
		allMembers.filter(
			(am) =>
				!members.some((mem) => mem.uri === am.memberCode) &&
				!inactiveMembers.some((mem) => mem.uri === am.memberCode)
		)
	);

	return { members, nonMembers, inactiveMembers };
}

// Get members who were relevant on given date
function parseRelevantMembers(
	members: RawCommitteeMember[],
	date: Date
): RawCommitteeMember[] {
	return members.filter((member) =>
		isRelevantDate(member.memberDateRange, date)
	);
}

function isRelevantDate(dr: DateRangeStr, date: Date): boolean {
	const start = new Date(dr.start);
	const end = dr.end ? new Date(dr.end) : new Date();

	return start <= date && end >= date;
}

function formatAsURIpair(
	members: RawCommitteeMember[] | RawMember[]
): URIpair[] {
	return members.map((com) => {
		return {
			uri: com.uri!,
			name: `${com.lastName} ${com.firstName}`,
		};
	});
}
export { getMembersAndNonMembers };
