/** @format */

import { WikiPosition } from '@/models/member/wiki_profile';
import { MemberConstituency } from '@/models/oireachtas_api/Formatted/Member/constituency';

export function consolidateMemberships(
	constituencies: {
		dail?: MemberConstituency[];
		seanad?: MemberConstituency[];
	},
	positions: WikiPosition[]
) {
	if (positions.length === 0) return undefined;

	const partyPositions: WikiPosition[] = [];
	const otherConstits: WikiPosition[] = [];
	const otherPositions: WikiPosition[] = [];
	const wikiMinistries: WikiPosition[] = [];

	positions?.forEach((wiki) => {
		if (
			wiki.type === 'td' ||
			wiki.type === 'senator' ||
			wiki.type === 'ceann comhairle' ||
			wiki.type === 'leas-cheann comhairle' ||
			wiki.type === 'committee chair'
		)
			return;
		else if (wiki.type.includes('party')) partyPositions.push(wiki);
		else if (wiki.type === 'mp' || wiki.type === 'mep' || wiki.type === 'mla')
			otherConstits.push(wiki);
		else if (
			wiki.type === 'senior minister' ||
			wiki.type === 'junior minister' ||
			wiki.type === 'government chief whip'
		)
			wikiMinistries.push(wiki);
		else otherPositions.push(wiki);
	});

	const allConstits = {
		...constituencies,
		...(otherConstits! && { other: otherConstits }),
	};
	return { constituencies: allConstits, partyPositions, otherPositions };
}
