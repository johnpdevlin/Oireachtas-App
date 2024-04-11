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
	const sortedParties = parties
		.toSorted(
			(a, b) =>
				new Date(b.dateRange.start).getTime() -
				new Date(a.dateRange.start).getTime()
		)
		.map((p) => {
			return {
				name: p.showAs,
				uri: p.partyCode,
				dateRange: {
					start: p.dateRange.start,
					end: getEndDateStr(p.dateRange.end!)! ?? undefined,
				},
			};
		});

	return sortedParties;
}
