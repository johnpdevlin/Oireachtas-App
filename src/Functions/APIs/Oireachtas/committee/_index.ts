/** @format */
import {
	RawCommittee,
	RawCommitteeMember,
} from '@/models/oireachtasApi/committee';
import fetchMembers from '../member/raw/_member_details';
import { RawMemberCommittee } from '@/models/oireachtasApi/member';
import { excludeProperties } from '@/functions/_utils/objects';
import { DateRangeStr } from '@/models/dates';
import { removeDuplicateObjects } from '../../../_utils/arrays';

async function fetchCommittees(dateRange?: DateRangeStr): Promise<{
	committees: RawCommittee[];
	memberCommittees: RawMemberCommittee[];
}> {
	const allMembers = await fetchMembers({});

	let committees: RawCommittee[] = [];
	let memberCommittees: RawMemberCommittee[] = [];

	// Parse all committees
	allMembers?.forEach((am) => {
		const uri = am.memberCode;
		am.memberships.forEach((mem) => {
			if (mem.membership.committees! && mem.membership.committees.length > 0)
				mem.membership.committees.forEach((committee: RawMemberCommittee) => {
					memberCommittees.push({
						...committee,
						fullName: am.fullName,
						firstName: am.firstName,
						lastName: am.lastName,
						committeeURI: committee.uri,
						uri: uri,
					});
					const comm = excludeProperties(committee, [
						'role',
						'memberDateRange',
					]);
					comm.members = [];
					committees.push(comm);
				});
		});
	});

	// Add members to committee objects
	committees = committees.map((committee) => {
		const members = memberCommittees
			.filter((c) => c.committeeURI === committee.uri)
			.map((member) => {
				return {
					role: member.role,
					uri: member.uri,
					fullName: member.fullName,
					firstName: member.firstName,
					lastName: member.lastName,
					memberDateRange: member.memberDateRange,
					houseNo: member.houseNo,
				} as RawCommitteeMember;
			});

		return {
			...committee,
			members,
		};
	});

	if (dateRange) {
		const { start, end } = dateRange;
		const s = new Date(start);
		const e = new Date(end!);
		committees = committees.filter((c) => {
			const commStart = new Date(c.committeeDateRange.start);
			const commEnd = c.committeeDateRange.end!
				? new Date(c.committeeDateRange.end)
				: new Date();
			if (commStart <= s && commEnd >= e) return true;
			else return false;
		});
		memberCommittees = memberCommittees.filter((mc) => {
			const mcStart = new Date(mc.committeeDateRange.start);
			const mcEnd = mc.committeeDateRange.end!
				? new Date(mc.committeeDateRange.end)
				: new Date();
			if (mcStart <= s && mcEnd >= e) return true;
			else return false;
		});
	}

	return {
		committees: removeDuplicateObjects(committees),
		memberCommittees: removeDuplicateObjects(memberCommittees),
	};
}

export { fetchCommittees };
