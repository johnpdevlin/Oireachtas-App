/** @format */

import { membership } from '../../../../Models/UI/member';
import { processMembershipType } from './Functions';

// REFORMATS PARTY OBJECTS
export default function processOffices(offices: any[]): {
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

	return processMembershipType(offices, 'office');
}
