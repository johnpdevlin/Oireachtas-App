/** @format */
import fetchConstituencies from '../../Fetcher/OireachtasAPI/constituencies';
import fetchHouses from '../../Fetcher/OireachtasAPI/houses';
import fetchMember from '../../Fetcher/OireachtasAPI/member';
import fetchParties from '../../Fetcher/OireachtasAPI/parties';
import house from '../../Models/house';
import {
	participationRecord,
	groupParticipationRecord,
} from '../../Models/UI/participation';
import aggregateConstitRecords from '../Aggregate/constituencies';
import aggregateHouseRecords from '../Aggregate/house';
import { aggregateMemberRecords } from '../Aggregate/member';
import aggregatePartyRecords from '../Aggregate/parties';
import { writeAggregateRecordsBatch } from './writeToFirestore/writeBatch';

export async function aggregateParticipationChecker(
	chamber: 'dail' | 'seanad',
	session: number,
	dates?: { start?: Date; end?: Date }
) {
	console.log(
		`Aggregated Records for ${chamber}${session} update started at ${new Date()}`
	);

	const members = await fetchMember({ chamber, houseNo: session });
	const house: house | any = await fetchHouses({
		houseNo: session,
		chamber: chamber,
	});

	const memberRecords = await aggregateMemberRecords(members, house);

	const parties = await fetchParties({ chamber: chamber, houseNo: session });
	const constituencies = await fetchConstituencies({
		chamber: chamber,
		houseNo: session,
	});

	// reuses and aggregates data
	const partiesRecords: groupParticipationRecord[] = aggregatePartyRecords({
		members: members,
		memberRecords: memberRecords,
		parties: parties,
		house: house,
	});
	const constitRecords: groupParticipationRecord[] = aggregateConstitRecords({
		members: members,
		memberRecords: memberRecords,
		constits: constituencies,
		house: house,
	});

	const houseRecords: groupParticipationRecord = aggregateHouseRecords(
		memberRecords,
		house
	);

	const batchArray: participationRecord | groupParticipationRecord[] = [
		houseRecords,
		...memberRecords,
		...partiesRecords,
		...constitRecords,
	];

	writeAggregateRecordsBatch(batchArray);
	console.log(`It's done then`);
}
