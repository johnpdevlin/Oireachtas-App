/** @format */
import {
	CommitteeName,
	RawCommittee,
	RawCommitteeMember,
} from '@/models/oireachtasApi/committee';
import fetchMembers from '../../member/raw/_member_details';
import { RawMemberCommittee } from '@/models/oireachtasApi/member';
import { excludeProperties } from '@/functions/_utils/objects';
import { DateRangeStr } from '@/models/dates';
import similarity from 'string-similarity';

async function fetchAllDetailedCommittees(): Promise<{
	committees: RawCommittee[];
	memberCommittees: RawMemberCommittee[];
}> {
	const allMembers = await fetchMembers({});

	let committees = new Map<string, RawCommittee>();
	let memberCommittees = new Map<string, RawMemberCommittee>();

	// Parse all committees
	if (allMembers)
		for (let am of allMembers) {
			const uri = am.memberCode;
			am.memberships.forEach((mem) => {
				if (mem.membership.committees! && mem.membership.committees.length > 0)
					mem.membership.committees.forEach((committee: RawMemberCommittee) => {
						memberCommittees.set(`${uri}-${committee.uri}`, {
							...committee,
							fullName: am.fullName,
							firstName: am.firstName,
							lastName: am.lastName,
							altCommitteeURIs: getAlternativeURIs(
								committee.committeeName,
								committee.uri
							),
							committeeURI: committee.uri,
							uri: uri,
						});
						const comm = excludeProperties(committee, [
							'role',
							'memberDateRange',
						]);
						comm.members = [];
						committees.set(comm.uri, comm);
					});
			});
		}

	const processedCommittees = new Map<string, RawCommittee>();
	// Add members to committee objects
	Array.from(committees.values()).forEach((committee) => {
		const members = Array.from(memberCommittees.values())
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

		processedCommittees.set(committee.uri, {
			...committee,
			members,
		});
	});

	return {
		committees: Array.from(processedCommittees.values()),
		memberCommittees: Array.from(memberCommittees.values()),
	};
}

function getAlternativeURIs(names: CommitteeName[], uri: string): string[] {
	if (names.length === 1) return [];

	const uriCode = uri.split('/').at(-1)!;
	const root = uri.split(uriCode!).at(0)?.slice(0, -1)!;
	let alternativeURIs: { uri: string; rating: number }[] = [];
	names.forEach((name) => {
		const altEn = name.nameEn.toLowerCase().replaceAll(' ', '_');
		const altGa = name.nameGa?.toLowerCase().replaceAll(' ', '_');
		const enRating = similarity.compareTwoStrings(altEn, uriCode);
		const gaRating = altGa && similarity.compareTwoStrings(altGa, uriCode);
		alternativeURIs.push({ uri: altEn, rating: enRating });
		if (altGa && gaRating)
			alternativeURIs.push({ uri: altGa, rating: gaRating });
	});

	const ratings = alternativeURIs?.map((a) => a.rating);
	const max = Math.max(...ratings);

	const processedAltURIs: string[] = alternativeURIs
		.filter((a) => a.rating !== max)
		.map((a) => root + a.uri);
	return processedAltURIs;
}

export { fetchAllDetailedCommittees };
