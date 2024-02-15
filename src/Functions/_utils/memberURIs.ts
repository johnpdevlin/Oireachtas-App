/** @format */

import { BinaryChamber, MemberBaseKeys, URIpair } from '@/models/_utils';
import similarity, { BestMatch } from 'string-similarity';
import { RawMember } from '@/models/oireachtasApi/member';
import fetchMembers from '../APIs/Oireachtas/member/raw/_member_details';

export async function getMemberUrisAndNames(
	names: string[],
	chamber: BinaryChamber,
	houseNo: number
): Promise<MemberBaseKeys[]> {
	const memberObjs = (await fetchMembers({
		chamber: chamber,
		house_no: houseNo,
	})) as RawMember[];

	const memberURIs: MemberBaseKeys[] = memberObjs.map((member) => {
		return {
			name: member.fullName,
			uri: member.memberCode,
			house_code: chamber,
		};
	});

	const matchedMembers: MemberBaseKeys[] = assignMemberURIsAndNames(
		names,
		memberURIs
	).matches;

	return matchedMembers;
}

// Uses similarity to match standard URI pairs to input string names, improved version
export function assignMemberURIsAndNames<
	T extends { name: string; uri: string }
>(names: string[], members: T[]): { matches: T[]; unMatched: string[] } {
	names = names.map((name) => {
		if (names.includes(', '))
			name.split(',').map((nm) => names.push(nm.trim().toLowerCase()));
		return name.toLowerCase();
	});

	let matches: T[] = [];
	let unSortedMatches: { name: string; bestMatch: BestMatch }[] = [];
	const uriNames = members.map((member) => member.name.toLowerCase());

	names.forEach((name) => {
		if (typeof name !== 'string') console.info(name);

		const bestMatchResult = similarity.findBestMatch(name, uriNames);
		const bestMatch = bestMatchResult.bestMatch;

		if (bestMatch.rating > 0.3) {
			// Find the member with the exact name match from the original list
			const matchedMember = members.find(
				(member) => member.name.toLowerCase() === bestMatch.target
			);

			if (matchedMember) {
				// Ensure we do not add duplicates
				if (!matches.some((match) => match.uri === matchedMember.uri)) {
					matches.push(matchedMember);
				}
			}
		} else {
			unSortedMatches.push({ name, bestMatch: bestMatchResult });
		}
	});

	// Handling similar but not exact matches
	unSortedMatches.forEach((unMatch) => {
		const potentialMatches = similarity.findBestMatch(unMatch.name, uriNames);
		potentialMatches.ratings
			.filter((rating) => rating.rating > 0.3)
			.sort((a, b) => b.rating - a.rating) // Sort by descending rating
			.forEach((rating) => {
				const matchedMember = members.find(
					(member) => member.name.toLowerCase() === rating.target
				);
				if (
					matchedMember &&
					!matches.some((match) => match.uri === matchedMember.uri)
				) {
					matches.push(matchedMember);
					// Once a match is found and added, remove it from the unsorted list
					unSortedMatches = unSortedMatches.filter(
						(unsorted) => unsorted.name !== unMatch.name
					);
				}
			});
	});

	const unmatchedURIs = unSortedMatches.map((unMatch) => unMatch.name);

	return {
		matches,
		unMatched: unmatchedURIs?.length > 0 ? unmatchedURIs : [],
	};
}
