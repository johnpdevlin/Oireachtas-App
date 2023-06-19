/** @format */
import aggregateVotes from './Member/votes';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import { ParticipationRecord } from '@/Models/participation';
import fetchVotes from '@/Functions/API-Calls/OireachtasAPI/votes';
import aggregateQuestions from './Member/questions';
import aggregateSpeeches from './Member/speeches';
import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import getSittingDates from '../../getSittingDates';

export async function aggregateMemberRecords(
	members: RawFormattedMember[],
	start: string,
	end: string | undefined
) {
	const records: ParticipationRecord[] = [];

	const rawHouseVotes = await fetchVotes({
		chamber_type: 'house',
		chamber: 'dail',
		houseNo: 33,
		date_start: start,
		date_end: end,
	});

	const rawCommitteeVotes = await fetchVotes({
		chamber_type: 'committee',
		date_start: start,
		date_end: end,
	});

	// for (let m of members) {
	// Clause for members who didn't serve for full session

	const dailVotes = await aggregateVotes({
		member: members[90].uri,
		rawVotes: rawHouseVotes,
	});

	const committeeVotes = await aggregateVotes({
		member: members[22].uri,
		rawVotes: rawCommitteeVotes,
	});

	const questions = await aggregateQuestions(members[22].uri, start, end!);

	const speeches = await aggregateSpeeches(members[22].uri, start, end!);

	const sitting = getSittingDates(start, end!);
	// const datesHouseAttended = [
	// 	...votes.datesHouseVoted,
	// 	...speeches.datesHouseSpoke,
	// 	...questions.datesOQsAsked,
	// ];
	// const datesCommitteeAttended = [
	// 	...votes.datesCommitteeVoted,
	// 	...speeches.datesCommitteeSpoke,
	// ];

	// // Array of dates where contributions made
	// // Set used to avoid duplicates
	// let present: Set<String> = new Set();

	// for (let d of datesHouseAttended) {
	// 	if (house.chamber == 'dail') {
	// 		present.add(d.toDateString());

	// 		// Adds any additional unaccounted for sittings
	// 		for (let s of datesSitting.dailNotSitting) {
	// 			if (d.toDateString() == s.toDateString()) {
	// 				datesSitting.dailSitting.push(s);
	// 			}
	// 		}
	// 	} else if (house.chamber == 'seanad') {
	// 		for (let s of datesSitting.seanadNotSitting) {
	// 			if (d.toDateString() == s.toDateString()) {
	// 				datesSitting.seanadSitting.push(s);
	// 			}
	// 		}
	// 	}
	// }
	// let record: participationRecord = {
	// 	name: m.fullName,
	// 	uri: m.uri,
	// 	members: [m.uri],
	// 	house: house.chamber,
	// 	houseNo: house.houseNo,
	// 	houseContributed: present.size,
	// 	noHouseContribution: 0,
	// 	houseVotes: votes.houseVotes,
	// 	houseSpeeches: speeches.houseSpeeches,
	// 	oralQuestions: questions.oralQuestions,
	// 	writtenQuestions: questions.writtenQuestions,
	// };

	// records.push(record);

	// console.log(
	// 	`${m.fullName} has been successfully completed at ${new Date()}`
	// );
	// }

	// const dailSitting: Set<String> = new Set();

	// for (let ds of datesSitting.dailSitting) {
	// 	dailSitting.add(ds.toDateString());
	// }

	// for (let r of records) {
	// 	r.noHouseContribution = dailSitting.size - r.houseContributed;
	// }

	// console.log(`Completed at ${new Date()}`);

	// return records;
}
