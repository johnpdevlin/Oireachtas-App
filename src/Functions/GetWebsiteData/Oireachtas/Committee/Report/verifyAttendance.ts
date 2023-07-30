/** @format */

import { removeDuplicateObjects } from '@/Functions/Util/arrays';
import { assignMemberURIsAndNames } from '@/Functions/Util/memberURIs';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import {
	CommitteeType,
	MemberBaseKeys,
	BinaryChamber,
} from '@/Models/_utility';
import { Committee, PastCommitteeMember } from '@/Models/committee';

// Cross references names against members of committees and if select or joint etc.
// Checks for pastMembers who are current for given date
// Returns verified attendances and absences
export function verifyAttendance(
	type: CommitteeType,
	present: string[],
	committee: Committee,
	allMembers: RawFormattedMember[],
	date: Date,
	alsoPresent?: string[]
): {
	present: MemberBaseKeys[];
	absent?: MemberBaseKeys[];
	alsoPresent?: MemberBaseKeys[];
} {
	// Remove any undefined values from the arrays
	let chamber: BinaryChamber = 'dail';

	// Get members specific to joint or select committees etc.
	const members: MemberBaseKeys[] = [];
	if (committee.members!) {
		const dail = committee.members?.dail;
		const seanad = committee.members?.seanad;
		if (dail!) {
			members.push(...(committee.members.dail as MemberBaseKeys[]));
		}
		if (seanad!) {
			if (type === 'select') chamber = 'seanad';
			if ((chamber === 'dail' && type !== 'select') || chamber === 'seanad')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
		}
	} else {
		console.warn('No committee.');
	}
	// Filter out oireachtas members that aren't on committee
	const nonMembers: MemberBaseKeys[] = allMembers
		.filter((am) => members.every((com) => com.uri !== am.uri))
		?.map((member) => {
			return {
				name: member.name,
				uri: member.uri,
				houseCode: chamber,
			};
		});

	// Ascertain how current pastMembers should be dealt with
	// Some will be current for reports before their endDate
	const pastMembers: PastCommitteeMember[] = [];
	if (committee.pastMembers!) {
		// Get members specific to joint or select committees etc.
		const dail = committee.pastMembers?.dail;
		const seanad = committee.pastMembers?.seanad;
		if (dail! && dail!.length > 0) {
			pastMembers.push(...(dail as PastCommitteeMember[]));
		}
		if (seanad! && seanad!.length > 0) {
			if (type === 'select') chamber = 'seanad';
			if (chamber === 'dail' && type !== 'select')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
			else if (chamber === 'seanad')
				members.push(...(committee.members.seanad as MemberBaseKeys[]));
			if (type === 'select') chamber = 'seanad';
			if ((chamber === 'dail' && type !== 'select') || chamber === 'seanad')
				pastMembers.push(...(seanad as PastCommitteeMember[]));
		}
		pastMembers.forEach((member) => {
			const mDateRange = member.dateRange;
			const memberObj: MemberBaseKeys = {
				uri: member.uri,
				name: member.name,
				houseCode: member.houseCode,
			};
			if (date.getTime() > mDateRange.date_start.getTime()) {
				if (
					mDateRange.date_end! &&
					date.getTime() < mDateRange.date_end.getTime()
				)
					members.push(memberObj);
			} else {
				nonMembers.push(memberObj);
			}
		});
	}

	const confirmedPresent = assignMemberURIsAndNames(present, members);
	const confirmedAbsent = members.filter(
		(member) => !confirmedPresent.matches.some((cp) => cp.uri == member.uri)
	);

	// Handle possible attendees picked up as committee members
	if (confirmedPresent.unMatchedURIs!)
		if (!alsoPresent) alsoPresent = [...confirmedPresent.unMatchedURIs!];
		else if (alsoPresent!)
			alsoPresent = [...alsoPresent, ...confirmedPresent.unMatchedURIs];

	let confirmedAlsoPresent;
	if (alsoPresent! && alsoPresent.length > 0) {
		confirmedAlsoPresent = assignMemberURIsAndNames(alsoPresent, nonMembers);
		if (
			confirmedAlsoPresent.unMatchedURIs &&
			confirmedAlsoPresent.unMatchedURIs.length > 0
		) {
			console.warn(
				`No matches found for ${confirmedAlsoPresent.unMatchedURIs}`
			);
		}
		const edgeCase = confirmedAlsoPresent.matches.filter((conAlso) =>
			confirmedPresent.matches.some((conAb) => conAb.uri === conAlso.uri)
		);
		if (edgeCase.length > 0) {
			console.warn(
				`Issue with ${edgeCase} \n Being picked up as also present rather than present.`
			);
		}
	}

	return {
		present: removeDuplicateObjects(confirmedPresent.matches),
		...(confirmedAlsoPresent! && {
			alsoPresent: removeDuplicateObjects(confirmedAlsoPresent.matches),
		}),
		...(confirmedAbsent! && {
			absent: removeDuplicateObjects(confirmedAbsent),
		}),
	};
}
