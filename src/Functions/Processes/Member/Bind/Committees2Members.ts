/** @format */

import { MemberCommitteeDetail } from '../Oireachtas/Website/parseCommittee';

export default function bindCommittees2Members<T extends { uri: string }>(
	currentCommittees: MemberCommitteeDetail[],
	pastCommittees: MemberCommitteeDetail[],
	members: T[]
): T[] {
	console.info('Binding Committees to Members...');
	const parsedMembers: T[] = [];

	members.forEach((member) => {
		const current = currentCommittees
			.filter((com) => com.uri === member.uri)
			.map((com) => com.committee);
		const past = pastCommittees
			.filter((com) => com.uri === member.uri)
			.map((com) => com.committee);
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
