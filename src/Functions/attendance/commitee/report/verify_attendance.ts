/** @format */

import { removeDuplicateObjects } from '@/functions/_utils/arrays';
import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';
import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeType, MemberBaseKeys } from '@/models/_utils';
import { Committee } from '@/models/committee';
import { getMembersAndNonMembers } from './handle_members';

type AttendanceResult = {
	type: string;
	present: MemberBaseKeys[];
	absent: MemberBaseKeys[];
	alsoPresent: MemberBaseKeys[];
};

export function verifyAttendance(
	type: CommitteeType,
	present: string[],
	committee: Committee,
	allMembers: RawMember[],
	date: Date,
	alsoPresent: string[]
): AttendanceResult {
	// Gets members relevant to date and non-members

	const { members, nonMembers } = getMembersAndNonMembers(
		committee,
		type,
		allMembers,
		date
	)!;

	const confirmedAlsoPresent: MemberBaseKeys[] = [];
	const confirmedPresent = assignMemberURIsAndNames(present, members);

	const confirmedAbsent = members.filter((member) =>
		confirmedPresent!.matches.some((cp) => cp.uri === member.uri)
	);

	// Verifies alsoPresent's members attendance
	// Deals with unmatched names to check if valid etc.
	if (alsoPresent.length > 0 || confirmedPresent.unMatched.length > 0) {
		const processed = assignMemberURIsAndNames(
			[...alsoPresent, ...confirmedPresent.unMatched],
			nonMembers
		);
		confirmedAlsoPresent.push(...processed.matches);
		if (processed.unMatched.length > 0) {
			console.log(date, committee);
			console.log(processed.unMatched.join(', '));
		}
	}

	return {
		type: type,
		present: removeDuplicateObjects(confirmedPresent.matches),
		alsoPresent: removeDuplicateObjects(confirmedAlsoPresent),
		absent: removeDuplicateObjects(confirmedAbsent),
	};
}
