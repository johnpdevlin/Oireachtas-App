/** @format */
import { RawMparty } from '.';
import { OirDate } from '@/Models/dates';
import { getEndDateStr } from '@/Functions/_util/dates';
import { MemberParty } from '@/Models/DB/Member/party';

/* Sorts by earliest date
   Parses to find gaps where immediate party is not the same 
   Returns structured objects by most recent */
export default function parseAndFormatParties(
	parties: RawMparty[]
): MemberParty[] {
	const sortedParties = parties.sort(
		(a, b) => b.dateRange.start.getTime() - a.dateRange.start.getTime()
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
				dateRangeStr: {
					start: p.dateRange.start as OirDate,
					end: getEndDateStr(p.dateRange.end as OirDate | undefined | null),
				},
				dateRange: { start: p.dateRange.start, end: p.dateRange.end },
			};
		} else {
			currentParty.dateRangeStr.end = getEndDateStr(
				p.dateRange.end as OirDate | undefined | null
			);
			currentParty.dateRange.end = p.dateRange.end;
		}

		if (index === sortedParties.length - 1 && currentParty) {
			results.push(currentParty);
		}
	});

	return results;
}
