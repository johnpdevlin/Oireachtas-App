/** @format */

import { Chamber, URIpair } from '@/Models/_utility';
import fetchMembers from '../API-Calls/OireachtasAPI/members';
import similarity, { BestMatch, Rating } from 'string-similarity';
import { v4 as uuidv4 } from 'uuid';
import { capitaliseFirstLetters } from './strings';

export async function getMemberUrisAndNames(
	names: string[],
	chamber: Exclude<Chamber, 'dail & senead'>,
	houseNo: number
): Promise<URIpair[]> {
	const memberObjs = await fetchMembers({
		chamber: chamber,
		house_no: houseNo,
	});

	const memberURIs: URIpair[] = memberObjs.map((member) => {
		return { name: member.name, uri: member.uri };
	});

	const matchedMembers: URIpair[] = assignMemberURIsAndNames(
		names,
		memberURIs
	).matches;

	return matchedMembers;
}

// Uses similarity to match standard URI pairs to input string names
export function assignMemberURIsAndNames(
	names: string[],
	members: URIpair[]
): { matches: URIpair[]; unMatchedURIs?: string[] } {
	names = names.map((name) => {
		return capitaliseFirstLetters(name);
	});
	const matchedPairs: { name: string; member: URIpair }[] = [];
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
			} else {
				console.warn(
					`${match.name} is not matched. \n Possible matches: ${uriNames.join(
						', '
					)} `
				);
			}
		});
	}

	const matches = matchedPairs.map((match) => {
		return { name: match.member.name, uri: match.member.uri };
	});
	return {
		matches: matches,
		...(unSortedMatches && {
			unMatchedURIs: unSortedMatches.map((us) => us.name),
		}),
	};
}
