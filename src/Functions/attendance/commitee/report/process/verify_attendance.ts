/** @format */

import { removeDuplicateObjects } from '@/functions/_utils/arrays';
import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';
import { RawMember } from '@/models/oireachtasApi/member';
import { URIpair } from '@/models/_utils';
import { getMembersAndNonMembers } from './handle_members';
import { dateToYMDstring } from '../../../../_utils/dates';
import { RawCommittee } from '@/models/oireachtasApi/committee';

type AttendanceResult = {
	present: URIpair[];
	absent: URIpair[];
	alsoPresent: URIpair[];
};

export function verifyAttendance(
	url: string,
	date: Date,
	present: string[],
	alsoPresent: string[],
	committee: RawCommittee,
	allMembers: RawMember[]
): AttendanceResult {
	const attendanceRecorded = [...present, ...alsoPresent];

	// Get members relevant to the date and non-members
	const { members, nonMembers, inactiveMembers } = getMembersAndNonMembers(
		committee,
		allMembers,
		date
	);

	const possibleMembers = [...members, ...inactiveMembers] as URIpair[];

	if (!members)
		console.info(
			`url: ${url} \n No members found for committee: ${committee.committeeName} on ${date}.`
		);

	let confirmedPresent: {
		matches: URIpair[];
		unMatched: string[];
	} = { matches: [], unMatched: [] };

	try {
		confirmedPresent = assignMemberURIsAndNames(
			attendanceRecorded,
			possibleMembers
		);
	} catch (e) {
		console.error(`url: ${url} \n Error assigning member URIs and names: ${e}`);
	}

	const confirmedAbsent =
		members.filter(
			(member) => !confirmedPresent.matches.some((cp) => cp.uri === member.uri)
		) ?? [];

	const confirmedAlsoPresent: URIpair[] = [];
	if (confirmedPresent.unMatched.length > 0) {
		const processed = assignMemberURIsAndNames(
			confirmedPresent.unMatched,
			nonMembers
		);
		confirmedAlsoPresent.push(...processed.matches);
		processed.unMatched = processed.unMatched.filter((un) => {
			const isUnmatchedValid =
				!confirmedAlsoPresent.some(
					(cap) => cap.name.toLowerCase().trim() === un.toLowerCase().trim()
				) &&
				!confirmedPresent.matches.some(
					(cp) => cp.name.toLowerCase().trim() === un.toLowerCase().trim()
				) &&
				un.split(' ').length >= 4;
			return isUnmatchedValid;
		});

		if (processed.unMatched.length > 0)
			console.log(`url: ${url}\n
		Unmatched members: ${processed.unMatched.join(', ')}`);
	}

	if (confirmedPresent.matches.length === 0)
		console.log(
			`url: ${url}\nNo members identified as present for committee ${committee.committeeName} on ${date}.`
		);

	return {
		present: removeDuplicateObjects(confirmedPresent.matches),
		alsoPresent: removeDuplicateObjects(confirmedAlsoPresent),
		absent: removeDuplicateObjects(confirmedAbsent),
	};
}
