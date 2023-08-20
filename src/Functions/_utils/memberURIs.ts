/** @format */

import { BinaryChamber, MemberBaseKeys, URIpair } from '@/models/_utils';
import fetchMembers from '../APIs_/Oireachtas_/members';
import similarity, { Rating } from 'string-similarity';
import { capitaliseFirstLetters } from './strings';
import { RawMember } from '@/models/oireachtasApi/member';

export async function getMemberUrisAndNames(
	names: string[],
	chamber: BinaryChamber,
	houseNo: number
): Promise<URIpair[]> {
	const memberObjs = (await fetchMembers({
		chamber: chamber,
		house_no: houseNo,
	})) as RawMember[];

	const memberURIs: MemberBaseKeys[] = memberObjs.map((member) => {
		return {
			name: member.fullName,
			uri: member.memberCode,
			houseCode: chamber,
		};
	});

	const matchedMembers: MemberBaseKeys[] = assignMemberURIsAndNames(
		names,
		memberURIs
	).matches;

	return matchedMembers;
}

// Uses similarity to match standard URI pairs to input string names
export function assignMemberURIsAndNames(
	names: string[],
	members: MemberBaseKeys[]
): { matches: MemberBaseKeys[]; unMatchedURIs?: string[] } {
	names = names.map((name) => {
		return capitaliseFirstLetters(name);
	});
	const matchedPairs: { name: string; member: MemberBaseKeys }[] = [];
	let unSortedMatches: { name: string; bestMatch: Rating }[] = [];
	const uriNames = members.map((member) => {
		return member.name;
	});

	for (const name of names) {
		const bestMatch = similarity.findBestMatch(name, uriNames);
		if (bestMatch.bestMatch.rating > 0.4) {
			const matchedPair = {
				name: name,
				member: members.find((m) => m.name === bestMatch.bestMatch.target)!,
			};
			matchedPairs.push(matchedPair);
		} else {
			unSortedMatches.push({ name: name, bestMatch: bestMatch.bestMatch });
		}
	}

	if (unSortedMatches.length > 0) {
		unSortedMatches.forEach((match) => {
			if (
				matchedPairs.filter((mp) => mp.member.name === match.bestMatch.target)
					.length === 0 &&
				match.bestMatch.rating > 0.3
			) {
				// If unsorted match's most likely match has not already been found
				matchedPairs.push({
					name: match.name,
					member: members.find((m) => m.name === match.bestMatch.target)!,
				});
				unSortedMatches = unSortedMatches.filter(
					(m) => m.name === match.bestMatch.target
				);
			}
		});
	}

	const matches = matchedPairs.map((match) => {
		return {
			name: match.member.name,
			uri: match.member.uri,
			houseCode: match.member.houseCode,
		};
	});
	return {
		matches: matches,
		...(unSortedMatches && {
			unMatchedURIs: unSortedMatches.map((us) => us.name),
		}),
	};
}
