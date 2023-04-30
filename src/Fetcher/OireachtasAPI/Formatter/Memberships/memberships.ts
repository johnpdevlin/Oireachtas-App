/** @format */

import { memberRequest } from '../../../../Models/apiRequests';
import fetchMember from '../../members';
import {
	member,
	membership,
	membershipType,
} from '../../../../Models/UI/member';

import processOffices from './offices';
import processParties from './parties';
import processConstituencies from './constituencies';
import { DateRangeSharp } from '@mui/icons-material';

// house details, values to update
export default function processMemberships(memberships: any[]) {
	// Finds TD Membership Instance by Dáil Term (Party, Constituency, Office)

	const partyInstances: any[] = [];
	const constituencyInstances: any[] = [];
	const officeInstances: any[] = [];
	let dails: membership[] = [];
	let seanads: membership[] = [];

	for (let m1 of memberships) {
		// Nested loop required as multidimensional array must be traversed

		let house = m1.membership.house.houseCode;
		let type: membershipType = 'house';

		const thisHouse: membership = {
			name: m1.membership.house.showAs,
			type: type,
			houseNo: m1.membership.house.houseNo,
			house: house,
			startDate: m1.membership.dateRange.start,
			endDate: m1.membership.dateRange.end,
			uri: `${house}_${m1.membership.house.houseNo.toString()}`,
		};

		house == 'dail' ? dails.push(thisHouse) : seanads.push(thisHouse);

		officeInstances.push(...m1.membership.offices);
		partyInstances.push(...m1.membership.parties);

		// Constituency Instance do not include dates, only linked to Dáil term
		// Thus additional code below required
		const { showAs, representCode, representType } =
			m1.membership.represents[0].represent;

		constituencyInstances.push({
			represent: {
				dateRange: m1.membership.dateRange,
				showAs: showAs,
				representCode: representCode,
				representType: representType,
			},
		});
	}

	// console.log(constituencyInstances);
	const parties = processParties(partyInstances);
	const constituencies = processConstituencies(constituencyInstances);
	const offices = processOffices(officeInstances);

	return { parties, constituencies, offices, dails, seanads };
	// console.log(offices);
	// console.log(constituencies);
	// console.log(parties);
}
