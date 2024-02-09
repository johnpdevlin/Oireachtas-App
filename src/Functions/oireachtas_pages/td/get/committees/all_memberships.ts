/** @format */

import { MemberCommittee } from '@/models/member';
import { MemberURI, BinaryChamber, MemberBaseKeys } from '@/models/_utils';
import { Committee, CommitteeMembers } from '@/models/committee';
import processAllCommitteeInfo from '@/functions/oireachtas_pages/committee/_all_committeesInfo';

export type MemberCommitteeDetail = {
	uri: MemberURI;
	committee: MemberCommittee;
};

export default async function getAllMembersFromCommittees(): Promise<{
	current: MemberCommitteeDetail[];
	past: MemberCommitteeDetail[];
}> {
	console.info('Destructuring members from committees.');
	const currentMemberships: MemberCommitteeDetail[] = [];
	const pastMemberships: MemberCommitteeDetail[] = [];

	const committeeData = (await processAllCommitteeInfo()).forEach(
		(committee: Committee) => {
			const parsed = parseMemberCommitteeDetails(committee, committee.chamber);
			if (parsed?.current) currentMemberships.push(...parsed.current);
			if (parsed?.past) pastMemberships.push(...parsed.past);
		}
	);
	console.info('All members destructured and returned.');
	return { current: currentMemberships, past: pastMemberships };
}

function parseMemberCommitteeDetails(
	committee: Committee,
	specifiedChamber?: BinaryChamber
):
	| {
			current: MemberCommitteeDetail[];
			past?: MemberCommitteeDetail[];
			chair: MemberBaseKeys;
	  }
	| undefined {
	const { name, uri, chamber, dail_no, chair, members, pastMembers } =
		committee;

	// Organise
	const currentMembersArr = createMembersArr(members, specifiedChamber);
	const pastMembersArr = createMembersArr(pastMembers, specifiedChamber);

	let memberCurrentCommittees: MemberCommitteeDetail[] = [];

	if (currentMembersArr!) {
		memberCurrentCommittees = currentMembersArr!.map((member) => {
			const memberCommittee = {
				uri: member.uri,
				committee: {
					name,
					uri,
					chamber,
					houseNo: dail_no,
					dateRange: committee.dateRange,
				},
			};
			return memberCommittee;
		});
	}
	let memberPastCommittees: MemberCommitteeDetail[] = [];
	if (pastMembersArr!) {
		memberPastCommittees = pastMembersArr!.map((member) => {
			const memberCommittee = {
				uri: member.uri,
				committee: {
					name: name,
					uri: uri,
					chamber: chamber,
					houseNo: dail_no,
					dateRange: member.dateRange,
				} as MemberCommittee,
			} as MemberCommitteeDetail;
			return memberCommittee;
		});
	}

	console.info(`${committee.name} members destructured.`);
	return {
		current: memberCurrentCommittees,
		past: memberPastCommittees,
		chair,
	};
}

function createMembersArr(members?: CommitteeMembers, chamber?: BinaryChamber) {
	if (!members) return undefined;

	if (chamber! && chamber === 'seanad' && members.seanad!) {
		return members.seanad;
	} else if (!chamber && members!.dail! && members!.seanad!) {
		return [...members.dail, ...members.seanad];
	} else {
		return members.dail;
	}
}
