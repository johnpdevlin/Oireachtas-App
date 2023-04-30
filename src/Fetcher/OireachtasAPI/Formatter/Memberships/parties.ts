/** @format */

import { membership } from '../../../../Models/UI/member';
import { processMembershipType } from './Functions';

// REFORMATS PARTY OBJECTS
export default function processParties(parties: any[]): {
	current: membership[];
	past: membership[];
} {
	// if (partyUris.length > 1) {
	// 	// IF MULTIPLE PARTIES
	// 	for (let p of partyUris) {
	// 		processIndividualParty(
	// 			parties.filter((party) => {
	// 				return party.party.partyCode == p;
	// 			})
	// 		);
	// 	}
	// } else if (partyUris.length == 1) {
	// 	// IF SINGLE PARTY
	// 	processIndividualParty(parties);
	// }

	return processMembershipType(parties, 'party');
}

// function processIndividualParty(partyInstances: any) {
// 	const { showAs, partyCode } = partyInstances[0].party; // Destructures to get basic details

// 	const periods = reformatPeriods(partyInstances); // Gets continuous periods of membership

// 	for (let p of periods) {
// 		// FOR EACH UNBROKEN PERIOD, CREATES NEW OBJECT
// 		const partyMembership: membership = {
// 			name: showAs,
// 			uri: partyCode,
// 			startDate: p.startDate,
// 			endDate: p.endDate,
// 		};
// 		tempPartyArray.push(partyMembership);
// 	}
// }

// function reformatPeriods(instances: any[]) {
// 	let startDate: Date = new Date();
// 	let endDate: Date | undefined = new Date();

// 	if (instances.length >= 2) {
// 		// Merges time periods and separates where breaks in party membership
// 		return mergeMembershipPeriods(instances.map((i) => i.party));
// 	} else if (instances.length == 1) {
// 		// If only one instance, no merging required
// 		return [
// 			{
// 				startDate: instances[0].party.dateRange.start,
// 				endDate: instances[0].party.dateRange.end,
// 			},
// 		];
// 	}
// }
