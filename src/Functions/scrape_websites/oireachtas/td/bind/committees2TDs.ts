/** @format */

import { MemberCommitteeDetail } from '../get/committees/all_memberships';

export default function bindCommittees2Members<T extends { uri: string }>(
	currentCommittees: MemberCommitteeDetail[],
	pastCommittees: MemberCommitteeDetail[],
	members: T[]
): T[] {
	console.info('Binding Committees to Members...');
	const parsedMembers: T[] = [];

	members.forEach((member) => {
		let current = currentCommittees
			.filter((com) => com.uri === member.uri)
			.map((com) => com.committee);
		let past = pastCommittees
			.filter((com) => com.uri === member.uri)
			.map((com) => com.committee);

		if (current.length > 0) {
			current.forEach((cur) => {
				if (cur.dateRange.end !== undefined) {
					past.push(cur);
					current = current.filter((c) => c.name !== cur.name);
				}
			});
		}

		if (past.length > 0) {
			past.forEach((pas) => {
				if (pas.dateRange.end === undefined) {
					current.push(pas);
					past = past.filter((p) => p.name !== pas.name);
				}
			});
		}

		parsedMembers.push({
			committees: {
				current: current,
				past: past,
			},
			...member,
		});
	});

	return parsedMembers;
}
