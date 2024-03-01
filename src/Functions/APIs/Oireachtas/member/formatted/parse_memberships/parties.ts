/** @format */
import { RawMparty } from './_index';
import { getEndDateStr } from '@/functions/_utils/dates';
import { MemberParty } from '@/models/member';

/* Sorts by earliest date
   Parses to find gaps where immediate party is not the same 
   Returns structured objects by most recent */
export default function parseAndFormatParties(
	parties: RawMparty[]
): MemberParty[] {
	const sortedParties = parties.sort(
		(a, b) =>
			new Date(b.dateRange.start).getTime() -
			new Date(a.dateRange.start).getTime()
	);

	let currentParty: MemberParty | null = null;
	const results: MemberParty[] = [];

	sortedParties.forEach((p, index) => {
		if (!currentParty || p.partyCode !== currentParty.uri) {
			if (currentParty) {
				results.push(currentParty);
			}

			currentParty = {
				name: p.showAs,
				uri: p.partyCode,
				dateRange: {
					start: p.dateRange.start,
					end: getEndDateStr(p.dateRange.end!),
				},
			};
		} else {
			currentParty.dateRange.end = getEndDateStr(p.dateRange.end!);
		}

		if (index === sortedParties.length - 1 && currentParty) {
			results.push(currentParty);
		}
	});

	return results;
}
