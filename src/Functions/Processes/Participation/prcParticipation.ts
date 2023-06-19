/** @format */

import fetchHouses from '@/Functions/API-Calls/OireachtasAPI/houses';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { Chamber } from '@/Models/_utility';
import { aggregateMemberRecords } from './Aggregate/member';

export async function prcParticipation(
	chamber: Chamber,
	house_no: number,
	dates?: { start?: string; end?: string }
) {
	console.log(
		`Aggregated Records for ${chamber}${house_no} update started at ${new Date()}`
	);

	const members = await fetchMembers({ chamber, house_no: house_no });

	const house = await fetchHouses({
		house_no: house_no,
		chamber: chamber,
	});

	// Gets dates from house session if not provided
	dates = { start: dates?.start, end: dates?.end };
	if (dates?.start == undefined) dates.start = house[0].dateRange.start;
	if (dates?.end == undefined)
		if (house[0].dateRange.endDate != undefined)
			dates.end = house[0].dateRange.end;

	const memberRecords = await aggregateMemberRecords(
		members,
		dates.start!,
		dates.end!
	);

	console.log(memberRecords);
	// const parties = await fetchParties({ chamber: chamber, houseNo: house_no });
	// const constituencies = await fetchConstituencies({
	// 	chamber: chamber,
	// 	houseNo: house_no,
	// });

	// // reuses and aggregates data
	// const partiesRecords: groupParticipationRecord[] = aggregatePartyRecords({
	// 	members: members,
	// 	memberRecords: memberRecords,
	// 	parties: parties,
	// 	house: house,
	// });
	// const constitRecords: groupParticipationRecord[] = aggregateConstitRecords({
	// 	members: members,
	// 	memberRecords: memberRecords,
	// 	constits: constituencies,
	// 	house: house,
	// });

	// const houseRecords: groupParticipationRecord = aggregateHouseRecords(
	// 	memberRecords,
	// 	house
	// );

	// const batchArray: participationRecord | groupParticipationRecord[] = [
	// 	houseRecords,
	// 	...memberRecords,
	// 	...partiesRecords,
	// 	...constitRecords,
	// ];

	// writeAggregateRecordsBatch(batchArray);
	// console.log(`It's done then`);
}
