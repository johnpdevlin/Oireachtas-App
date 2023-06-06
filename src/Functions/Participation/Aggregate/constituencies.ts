/** @format */

import house from '../../Models/house';
import { chamber, member } from '../../Models/UI/member';
import {
	groupParticipationRecord,
	participationRecord,
} from '../../Models/UI/participation';

export default function aggregateConstitRecords(props: {
	members: member[];
	memberRecords: participationRecord[];
	constits: any[];
	house: house;
}): groupParticipationRecord[] {
	const constitRecords: groupParticipationRecord[] = [];
	// iterates to create constit records objects

	console.log(`aggregateConstitRecords commenced at ${new Date()}`);

	for (let c of props.constits) {
		const chamber: chamber = props.house.chamber;

		const record: groupParticipationRecord = {
			name: c.constituencyOrPanel.showAs,
			uri: c.constituencyOrPanel.representCode,
			type: 'constituency',
			house: chamber,
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
			if (m.constituency!) {
				if (m.constituency!.uri == c.constituencyOrPanel.representCode) {
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
				console.log(m.uri, 'not in a constituency');
			}
		}
		constitRecords.push(record);
	}

	console.log(`Aggregated constit member records completed at ${new Date()}`);
	return constitRecords;
}
