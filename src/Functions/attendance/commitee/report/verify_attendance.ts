/** @format */

import { removeDuplicateObjects } from '@/functions/_utils/arrays';
import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';
import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeType, MemberBaseKeys, BinaryChamber } from '@/models/_utils';
import { Committee, CommitteeMember } from '@/models/committee';
import {
	getMembersAndNonMembers,
	getPastMembers,
	handlePastMembers,
} from './handle_members';

type AttendanceResult = {
	type: string;
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};

export function verifyAttendance(
	type: string,
	present: string[],
	committee: Committee,
	allMembers: RawMember[],
	date: Date,
	alsoPresent?: string[]
): AttendanceResult {
	let { members, nonMembers, warnings } = getMembersAndNonMembers(
		committee,
		allMembers
	);
	const pastMembers = getPastMembers(
		members[0]?.houseCode || 'dail',
		committee
	);

	// Sorts current past past members
	// to members or non members as on given date
	const handledPastMembers = handlePastMembers(
		pastMembers,
		members,
		nonMembers,
		date
	);
	members = handledPastMembers.members;
	nonMembers = handledPastMembers.nonMembers;

	const confirmedPresent = assignMemberURIsAndNames(present, members);
	const confirmedAbsent = members.filter(
		(member) => !confirmedPresent.matches.some((cp) => cp.uri === member.uri)
	);

	// handles any unmatched names which might be assigned to also present
	alsoPresent = handleUnmatchedURIs(alsoPresent, confirmedPresent);

	// Verifies alsoPresent's members attendance
	// Deals with unmatched names to check if valid etc.
	let confirmedAlsoPresent:
		| { matches: MemberBaseKeys[]; unMatchedURIs?: string[] }
		| undefined;
	if (alsoPresent && alsoPresent.length > 0) {
		confirmedAlsoPresent = assignMemberURIsAndNames(alsoPresent, nonMembers);
		if (
			confirmedAlsoPresent.unMatchedURIs &&
			confirmedAlsoPresent.unMatchedURIs.length > 0
		) {
			warnings.push(
				`No matches found for ${confirmedAlsoPresent.unMatchedURIs}`
			);
		}
		const edgeCases = confirmedAlsoPresent.matches.filter((conAlso) =>
			confirmedPresent.matches.some((conAb) => conAb.uri === conAlso.uri)
		);
		if (edgeCases.length > 0) {
			warnings.push(
				`Issue with ${edgeCases} \n Being picked up as also present rather than present.`
			);
		}
	}

	return {
		type: type,
		present: removeDuplicateObjects(confirmedPresent.matches),
		...(confirmedAlsoPresent && {
			alsoPresent: removeDuplicateObjects(confirmedAlsoPresent.matches),
		}),
		...(confirmedAbsent && {
			absent: removeDuplicateObjects(confirmedAbsent),
		}),
	};
}

function handleUnmatchedURIs(
	alsoPresent: string[] | undefined,
	confirmedPresent: { matches: MemberBaseKeys[]; unMatchedURIs?: string[] }
): string[] | undefined {
	if (confirmedPresent.unMatchedURIs) {
		return alsoPresent
			? [...alsoPresent, ...confirmedPresent.unMatchedURIs]
			: confirmedPresent.unMatchedURIs;
	}
	return alsoPresent;
}
