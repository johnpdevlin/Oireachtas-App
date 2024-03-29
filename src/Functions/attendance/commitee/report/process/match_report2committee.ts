/** @format */

import similarity from 'string-similarity';
import { RawCommittee } from '@/models/oireachtasApi/committee';

// Matches a report URI to a committee based on similarity and date.
export function matchReport2Committee(
	report_uri: string,
	committees: RawCommittee[],
	date: Date
): RawCommittee | undefined {
	const possibleURIs = getPossibleURIs(report_uri, committees, date);
	return findMatchingCommitteeURI(report_uri, possibleURIs, committees);
}

// Get possible committee URIs based on the report URI, committees, and date.
function getPossibleURIs(
	uri: string,
	committees: RawCommittee[],
	date: Date
): string[] {
	const houseNo = uri.split('/').at(-2);
	const currentTime = date.getTime();
	const possibleURIs: string[] = [];

	for (const committee of committees) {
		const {
			committeeDateRange,
			uri: committeeURI,
			altCommitteeURIs,
		} = committee;
		const { start, end } = committeeDateRange;
		const committeeStartTime = new Date(start).getTime();
		const committeeEndTime = end ? new Date(end).getTime() : Infinity;

		if (
			(!houseNo || committeeURI.includes(houseNo)) &&
			currentTime > committeeStartTime &&
			currentTime <= committeeEndTime
		) {
			possibleURIs.push(committeeURI);
			if (altCommitteeURIs) possibleURIs.push(...altCommitteeURIs);
		}
	}

	return possibleURIs;
}

// Finds the matching committee URI from the possible URIs.
export function findMatchingCommitteeURI(
	uri: string,
	possibleURIs: string[],
	committees: RawCommittee[]
): RawCommittee | undefined {
	const matchingCommittee = committees.find(
		(committee) =>
			committee.uri === uri ||
			(committee.altCommitteeURIs && committee.altCommitteeURIs.includes(uri))
	);

	if (matchingCommittee) return matchingCommittee;

	const bestMatch = similarity.findBestMatch(uri, possibleURIs).bestMatch
		.target;
	if (bestMatch) {
		return committees.find(
			(committee) =>
				committee.uri === bestMatch ||
				(committee.altCommitteeURIs &&
					committee.altCommitteeURIs.includes(bestMatch))
		);
	}

	console.warn('No matching committee found for URI: ', uri);
	return undefined;
}
