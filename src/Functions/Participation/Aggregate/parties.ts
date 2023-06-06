/** @format */

import house from '../../Models/house';
import { member } from '../../Models/UI/member';
import {
	participationRecord,
	groupParticipationRecord,
} from '../../Models/UI/participation';

export default function aggregatePartyRecords(props: {
	members: member[];
	memberRecords: participationRecord[];
	parties: any[];
	house: house;
}): groupParticipationRecord[] {
	console.log(`Aggregating Party records commenced: ${new Date()}`);
	const partyRecords: groupParticipationRecord[] = []; // aggregated array to be returned
	// iterates to create party records objects

	for (let p of props.parties) {
		// creates aggregated record
		const record: groupParticipationRecord = {
			name: p.party.showAs,
			uri: p.party.partyCode,
			type: 'party',
			house: props.house.chamber,
			houseNo: props.house.houseNo,
			members: [],
			count: 0,
			houseContributed: 0,
			noHouseContribution: 0,
			houseSpeeches: 0,
			oralQuestions: 0,
			writtenQuestions: 0,
			houseVotes: 0,
		};

		for (let m of props.members) {
			if (m.party!) {
				if (m.party.uri == p.party.partyCode) {
					for (let mr of props.memberRecords) {
						if (m.uri == mr.uri) {
							record.members.push(mr.uri);
							record.houseContributed += mr.houseContributed;
							record.noHouseContribution += mr.noHouseContribution;
							record.houseSpeeches += mr.houseSpeeches;
							record.oralQuestions! += mr.oralQuestions!;
							record.writtenQuestions! += mr.writtenQuestions!;
							record.houseVotes += mr.houseVotes;
						}
					}
				}
			} else {
				console.log(m.fullName, 'not in party ');
			}
		}
		partyRecords.push(record);
	}

	console.log(`Aggregated party member records completed ${new Date()}`);

	return partyRecords;
}
