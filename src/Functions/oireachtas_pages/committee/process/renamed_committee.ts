/** @format */

import {
	Committee,
	CommitteeMember,
	CommitteeMembers,
} from '@/models/committee';

// Handles cases where committee has been renamed
// Webpage does not show members, so must be taken from successor page
function formatRenamedCommittee(
	original: Committee,
	renamed: Committee
): Committee {
	const { start, end } = original.dateRange;
	const updatedCommittee = original;
	updatedCommittee.pastMembers = formatActiveRenamedMembers(
		renamed.members!,
		start,
		end!
	);

	if (renamed!.pastMembers!.dail!) {
		const parsed = parseRelevantPastMembers(renamed!.pastMembers!.dail!, end!);
		if (parsed) updatedCommittee!.pastMembers!.dail?.push(...parsed!);
	}
	if (renamed!.pastMembers!.seanad!) {
		const parsed = parseRelevantPastMembers(
			renamed!.pastMembers!.seanad!,
			end!
		);
		if (parsed) updatedCommittee!.pastMembers!.seanad?.push(...parsed!);
	}

	return updatedCommittee;
}

function formatActiveRenamedMembers(
	members: CommitteeMembers,
	start: Date,
	end: Date
): CommitteeMembers {
	const updatedMembers: CommitteeMembers = {
		dail: [],
		seanad: [],
	};
	if (members.dail!) {
		updatedMembers.dail! = members.dail?.map((member) => {
			return {
				...member,
				dateRange: { start, end },
			};
		});
	}
	if (members.seanad!) {
		updatedMembers.seanad! = members.seanad?.map((member) => {
			return {
				...member,
				dateRange: { start, end },
			};
		});
	}
	return updatedMembers;
}

// Checks which members relevant within liftime of original committee
function parseRelevantPastMembers(
	members: CommitteeMember[],
	end: Date
): CommitteeMember[] | undefined {
	return members
		.filter(
			(member) =>
				!member.dateRange.end ||
				member.dateRange.end!.getMonth() <= end.getMonth()
		)
		.map((member) => {
			if (member.dateRange!.end!.getMonth() <= end.getMonth()) {
				member.dateRange.end = end;
			}
			return member;
		});
}

export { formatRenamedCommittee };
