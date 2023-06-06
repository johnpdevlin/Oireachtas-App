/** @format */

import house from '../../Models/house';
import { member } from '../../Models/UI/member';
import {
	groupParticipationRecord,
	participationRecord,
} from '../../Models/UI/participation';

export default function aggregateHouseRecords(
	memberRecords: participationRecord[],
	house: house
): groupParticipationRecord {
	// iterates to create constit records object
	const record: groupParticipationRecord = {
		name: house.name,
		uri: house.uri,
		type: 'house',
		house: house.chamber,
		houseNo: house.houseNo,
		members: [],
		count: house.seats,
		houseContributed: 0,
		noHouseContribution: 0,
		houseSpeeches: 0,
		oralQuestions: 0,
		writtenQuestions: 0,
		houseVotes: 0,
	};

	for (let mr of memberRecords) {
		record.members.push(mr.uri);
		record.houseContributed += mr.houseContributed;
		record.noHouseContribution += mr.noHouseContribution;
		record.houseSpeeches += mr.houseSpeeches;
		record.oralQuestions! += mr.oralQuestions!;
		record.writtenQuestions! += mr.writtenQuestions!;
		record.houseVotes += mr.houseVotes;
	}

	console.log(`Aggregated house member records completed at ${new Date()}`);
	return record;
}
