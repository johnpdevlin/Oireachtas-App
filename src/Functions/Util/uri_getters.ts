/** @format */

import { Chamber, URIpair } from '@/Models/_utility';
import fetchMembers from '../API-Calls/OireachtasAPI/members';
import similarity from 'string-similarity';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';

export async function getMemberUrisAndNames(
	names: string[],
	chamber: Exclude<Chamber, 'dail & senead'>,
	houseNo: number
): Promise<URIpair[]> {
	const memberObjs = await fetchMembers({
		chamber: chamber,
		house_no: houseNo,
	});

	const matchedMembers: URIpair[] = [];
	for (const name of names) {
		const matchedMember = await getMemberUriAndName(name, memberObjs);
		if (matchedMember!) {
			matchedMembers.push(matchedMember);
		}
	}
	return matchedMembers;
}

export async function getMemberUriAndName(
	name: string,
	memberObjs?: RawFormattedMember[],
	chamber?: Chamber,
	houseNo?: number
): Promise<URIpair | undefined> {
	let bestMatch: { name: string; uri: string } | undefined;
	let maxSimilarity = 0;
	if (!memberObjs) {
		memberObjs = await fetchMembers({
			chamber: chamber,
			house_no: houseNo,
		});
	}
	// Find the best match for each report
	for (const member of memberObjs) {
		const similarityScore = similarity.compareTwoStrings(
			name.toLowerCase(), // Compare lowercase report name
			member.name.toLowerCase() // Compare lowercase member name
		);

		// Keep track of the best match so far
		if (similarityScore > maxSimilarity) {
			maxSimilarity = similarityScore;
			bestMatch = member;
		}
	}
	if (bestMatch) return { name: bestMatch.name, uri: bestMatch.uri };
}
