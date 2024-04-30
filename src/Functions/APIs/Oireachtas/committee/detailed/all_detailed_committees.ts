/** @format */

import {
	CommitteeName,
	RawCommittee,
	RawCommitteeMember,
	RawMemberCommittee,
} from '@/models/oireachtas_api/committee';
import fetchMembers from '../../member/raw/_member_details';

import { excludeProperties } from '@/functions/_utils/objects';
import similarity from 'string-similarity';

async function fetchAllDetailedCommittees(): Promise<{
	committees: RawCommittee[];
	memberCommittees: RawMemberCommittee[];
}> {
	const allMembers = await fetchMembers({});

	const committees: { [key: string]: RawCommittee } = {};
	const memberCommittees: { [key: string]: RawMemberCommittee } = {};

	if (allMembers) {
		allMembers.forEach((member) => {
			const uri = member.memberCode;
			member.memberships.forEach((mem) => {
				if (mem.membership.committees && mem.membership.committees.length > 0) {
					mem.membership.committees.forEach((committee: RawMemberCommittee) => {
						const key = `${uri}-${committee.uri}-${committee.memberDateRange.start}-${committee.committeeDateRange.start}`;
						memberCommittees[key] = {
							...committee,

							altCommitteeURIs: getAlternativeURIs(
								committee.committeeName,
								committee.uri
							),
							committeeURI: committee.uri,
							uri,
						};

						const comm = excludeProperties(committee, [
							'role',
							'memberDateRange',
						]);
						comm.members = [];
						const commKey = `${comm.uri}-${comm.committeeDateRange.start}`;
						committees[commKey] = comm;
					});
				}
			});
		});
	}

	const processedCommittees: { [key: string]: RawCommittee } = {};

	Object.values(committees).forEach((committee) => {
		let earliestDate = new Date();
		const members = Object.values(memberCommittees)
			.filter(
				(mem) =>
					mem.committeeURI === committee.uri ||
					(mem.altCommitteeURIs?.length > 0 &&
						committee.altCommitteeURIs?.length > 0 &&
						mem.altCommitteeURIs.some((ac) =>
							committee.altCommitteeURIs.includes(ac)
						))
			)
			.map((member) => {
				const start = new Date(member.memberDateRange.start);
				if (start < earliestDate) earliestDate = start;

				return {
					role: member.role,
					uri: member.uri,
					fullName: member.fullName,
					firstName: member.firstName,
					lastName: member.lastName,
					memberDateRange: member.memberDateRange,
					houseNo: member.houseNo,
				} as RawCommitteeMember;
			})
			.map((member) => {
				if (earliestDate === new Date(member.memberDateRange.start))
					member.memberDateRange.start = committee.committeeDateRange.start;

				return member;
			});

		processedCommittees[committee.uri] = {
			...committee,
			members,
		};
	});

	return {
		committees: Object.values(processedCommittees),
		memberCommittees: Object.values(memberCommittees),
	};
}

function getAlternativeURIs(names: CommitteeName[], uri: string): string[] {
	if (names.length === 1) return [];

	const uriCode = uri.split('/').at(-1)!;
	const root = uri.split(uriCode!).at(0)?.slice(0, -1)!;
	const alternativeURIs: string[] = [];
	names.forEach((name) => {
		const altEn = name.nameEn.toLowerCase().replaceAll(' ', '_');
		const altGa = name.nameGa?.toLowerCase().replaceAll(' ', '_');
		const enRating = similarity.compareTwoStrings(altEn, uriCode);
		const gaRating = altGa && similarity.compareTwoStrings(altGa, uriCode);
		alternativeURIs.push(altEn);
		if (altGa && gaRating) alternativeURIs.push(altGa);
	});

	const ratings = alternativeURIs.map((a) =>
		similarity.compareTwoStrings(a, uriCode)
	);
	const max = Math.max(...ratings);

	return alternativeURIs
		.filter((a, index) => ratings[index] !== max)
		.map((a) => root + a);
}

export { fetchAllDetailedCommittees };
