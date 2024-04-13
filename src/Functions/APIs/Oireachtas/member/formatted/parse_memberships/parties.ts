/** @format */

import { MemberParty } from '@/models/oireachtas_api/Formatted/Member/party';
import { RawMparty } from './_index';
import { DateRangeStr } from '@/models/dates';

/* Sorts by earliest date
   Parses to find gaps where immediate party is not the same 
   Returns structured objects by most recent */
export default function parseAndFormatParties(
	parties: RawMparty[]
): MemberParty[] {
	const processedParties: MemberParty[] = [];

	let currentParty: MemberParty | null = null;

	const sortedParties = parties.sort(
		(a, b) =>
			new Date(a.dateRange.start).getTime() -
			new Date(b.dateRange.start).getTime()
	);

	sortedParties.forEach((p) => {
		if (!currentParty) {
			currentParty = {
				uri: p.partyCode,
				name: p.showAs,
				dateRange: {
					start: p.dateRange.start,
					end: p.dateRange.end ?? undefined,
				} as DateRangeStr,
			};
		} else if (currentParty.uri === p.partyCode) {
			currentParty.dateRange.end = p.dateRange.end ?? undefined;
		} else {
			processedParties.push({ ...currentParty }); // Push a new copy of currentParty
			currentParty = {
				uri: p.partyCode,
				name: p.showAs,
				dateRange: {
					start: p.dateRange.start,
					end: p.dateRange.end ?? undefined,
				} as DateRangeStr,
			};
		}
	});

	if (currentParty) {
		processedParties.push(currentParty); // Push the last currentParty
	}

	return processedParties.toReversed();
}
