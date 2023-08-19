/** @format */

import { removeDuplicateObjects } from '@/Functions/_util/arrays';
import { assignMemberURIsAndNames } from '@/Functions/_util/memberURIs';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import {
	CommitteeType,
	MemberBaseKeys,
	BinaryChamber,
	MemberURI,
} from '@/Models/_util';
import {
	Committee,
	CommitteeMember,
} from '@/Models/Scraped/Oireachtas/committee';

type AttendanceResult = {
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
};

export function verifyAttendance(
	type: CommitteeType,
	present: string[],
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date,
	alsoPresent?: string[]
): AttendanceResult {
	const { members, nonMembers, warnings } = getMembersAndNonMembers(
		committee,
		allMembers
	);
	const pastMembers = getPastMembers(
		members[0]?.houseCode || 'dail',
		committee
	);

	// Sorts current past past members
	// to members or non members as on given date
	handlePastMembers(pastMembers, members, nonMembers, date);

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
		present: removeDuplicateObjects(confirmedPresent.matches),
		...(confirmedAlsoPresent && {
			alsoPresent: removeDuplicateObjects(confirmedAlsoPresent.matches),
		}),
		...(confirmedAbsent && {
			absent: removeDuplicateObjects(confirmedAbsent),
		}),
	};
}

function getMembersAndNonMembers(
	committee: Committee,
	allMembers: RawFormattedMember[]
): {
	members: MemberBaseKeys[];
	nonMembers: MemberBaseKeys[];
	warnings: string[];
} {
	const warnings: string[] = [];
	let chamber: BinaryChamber = 'dail';
	let members: MemberBaseKeys[] = [];
	let nonMembers: MemberBaseKeys[] = [];

	if (committee.members) {
		const dail = committee.members.dail;
		const seanad = committee.members.seanad;

		members = members.concat(dail || []);
		if (seanad && (chamber === 'dail' || committee.types?.[0] === 'select')) {
			members = members.concat(seanad);
			chamber = 'seanad';
		}
	} else {
		warnings.push('No committee.');
	}

	nonMembers = allMembers
		.filter((am) => members.every((com) => com.uri !== am.uri))
		.map((member) => ({
			name: member.name,
			uri: member.uri,
			houseCode: chamber,
		}));

	return { members, nonMembers, warnings };
}

// Sorts into current members and non members on given date
function getPastMembers(
	chamber: BinaryChamber,
	committee: Committee
): CommitteeMember[] {
	let pastMembers: CommitteeMember[] = [];
	if (committee.pastMembers) {
		const dail = committee.pastMembers.dail;
		const seanad = committee.pastMembers.seanad;

		pastMembers = pastMembers.concat(dail || []);
		if (seanad && (chamber === 'dail' || committee.types?.[0] === 'select')) {
			pastMembers = pastMembers.concat(seanad);
		}
	}
	return pastMembers;
}

function handlePastMembers(
	pastMembers: CommitteeMember[],
	members: MemberBaseKeys[],
	nonMembers: MemberBaseKeys[],
	date: Date
): void {
	pastMembers.forEach((member) => {
		const mDateRange = member.dateRange;
		const memberObj: MemberBaseKeys = {
			uri: member.uri as MemberURI,
			name: member.name,
			houseCode: member.houseCode,
		};

		if (date.getTime() > mDateRange.start.getTime()) {
			if (mDateRange.end && date.getTime() < mDateRange.end.getTime()) {
				members.push(memberObj);
			} else {
				nonMembers.push(memberObj);
			}
		}
	});
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
