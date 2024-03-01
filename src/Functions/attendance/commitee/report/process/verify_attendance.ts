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
	attendanceRecorded: string[],
	committee: RawCommittee,
	allMembers: RawMember[]
): AttendanceResult {
	// Gets members relevant to date and non-members
	const { members, nonMembers } = getMembersAndNonMembers(
		committee,
		allMembers,
		date
	);

	if (!members) console.info(`no members found.\n`, url, committee, date);

	const confirmedAlsoPresent: URIpair[] = [];

	const confirmedPresent = assignMemberURIsAndNames(
		attendanceRecorded,
		members
	);
	const confirmedAbsent =
		members.filter(
			(member) =>
				confirmedPresent!.matches.some((cp) => cp.uri === member.uri) === false
		) ?? [];

	// Verifies alsoPresent's members attendance
	// Deals with unmatched names to check if valid etc.
	if (confirmedPresent.unMatched.length > 0) {
		const processed = assignMemberURIsAndNames(
			confirmedPresent.unMatched,
			nonMembers
		);
		confirmedAlsoPresent.push(...processed.matches);

		processed.unMatched = processed.unMatched.filter((un) => {
			if (
				(confirmedAlsoPresent.some(
					(cap) => cap.name.toLowerCase().trim() === un.toLowerCase().trim()
				) === false &&
					confirmedPresent.matches.some(
						(cp) => cp.name.toLowerCase().trim() === un.toLowerCase().trim()
					) === false) ||
				un.split(' ').length < 4
			)
				return un;
		});
		if (
			(processed.unMatched.length > 1 &&
				processed.unMatched.length < 15 &&
				processed.unMatched[0].length < 50) ||
			(processed.unMatched.length === 1 &&
				processed.unMatched[0].includes(' ') &&
				processed.unMatched[0].length < 50)
		) {
			console.log(
				`\nURL:  ${url}`,
				`\nDATE:  ${dateToYMDstring(date)}`,
				`\nCOMMITTEE:  ${committee.uri}`,
				`\n\nUNMATCHED:  ${processed.unMatched}`,
				`\n\nconfirmed PRESENT:  ${confirmedPresent.matches
					.map((p) => p.name)
					.join(', ')}\n`,
				`\n\nATTENDANCE RECORDED:  ${attendanceRecorded.join(', ')}}`,
				`\nConfirmed ALSO PRESENT: ${confirmedAlsoPresent
					.map((m) => m.name)
					.join(', ')}`,
				`\nMEMBERS:  ${committee.members
					.map(
						(member) =>
							`${member.fullName} (${dateToYMDstring(
								new Date(member.memberDateRange.start)
							)} - ${
								member.memberDateRange.end
									? dateToYMDstring(new Date(member.memberDateRange.end))
									: undefined
							})`
					)
					.join(', ')}`
			);
		}
	}

	if (confirmedPresent.matches.length === 0)
		console.log(
			`...NO MEMBERS IDENTIFIED AS PRESENT...`,
			`\n\nURL:  ${url}`,
			`\n\nDATE:  ${date}`,
			`\n\nATTENDANCE RECORDED:  ${attendanceRecorded.join(', ')}}`,
			`\n\nConfirmed ALSO PRESENT: ${confirmedAlsoPresent
				.map((m) => m.name)
				.join(', ')}`,
			`\n\nCOMMITTEE:  ${committee.committeeName}`,
			`\n\nMEMBERS:  ${committee.members
				.map((member) => member.fullName)
				.join(', ')}`,
			'\n....................'
		);

	return {
		present: removeDuplicateObjects(confirmedPresent.matches),
		alsoPresent: removeDuplicateObjects(confirmedAlsoPresent),
		absent: removeDuplicateObjects(confirmedAbsent),
	};
}
