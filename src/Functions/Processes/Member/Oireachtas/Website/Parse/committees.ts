/** @format */

import { BinaryChamber, MemberURI } from '@/Models/_utility';
import {
	Committee,
	CommitteeMembers,
} from '../../../../../../Models/committee';
import { MemberCommittee } from '@/Models/DB/Member/committee';

export type MemberCommitteeDetail = {
	uri: MemberURI;
	committee: MemberCommittee;
};
export default function parseMemberCommitteeDetails(
	committee: Committee,
	specifiedChamber?: BinaryChamber
):
	| { current: MemberCommitteeDetail[]; past?: MemberCommitteeDetail[] }
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
					dateRangeStr: committee.dateRangeStr,
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
					dateRangeStr: member.dateRangeStr,
				} as MemberCommittee,
			} as MemberCommitteeDetail;
			return memberCommittee;
		});
	}

	return { current: memberCurrentCommittees, past: memberPastCommittees };
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
