/** @format */

import { eachDayOfInterval } from 'date-fns';
import fetchHouses from '../../Fetcher/OireachtasAPI/houses';
import house from '../../Models/house';
import { chamber, member } from '../../Models/UI/member';
import { participationRecord } from '../../Models/UI/participation';
import checkDatesSitting from '../CheckDatesSitting';
import aggregateQuestions from './member/questions';
import aggregateSpeeches from './member/speeches';
import aggregateVotes from './member/votes';

export async function aggregateMemberRecords(
	members: member[],
	house: house
): Promise<participationRecord[]> {
	let start: Date;
	let end: Date | undefined;

	// Gets dates from house session
	start = house.startDate;
	if (!house.endDate) {
		house.endDate = new Date();
	}
	end = house.endDate;

	let intervalDates: Date[] = [];
	// check for incorrrect dates
	if (start < end) {
		if (end != null || undefined) {
			intervalDates = eachDayOfInterval({ start, end });
		}
	} else {
		console.log('incorrect dates: start > end');
	}

	const datesSitting = await checkDatesSitting(intervalDates); // Gets Dates which house was sitting

	const records: participationRecord[] = [];

	for (let m of members) {
		// Clause for members who didn't serve for full session

		const votes = await aggregateVotes(m.uri, start!, end!);
		const questions = await aggregateQuestions(m.uri, start!, end!);
		const speeches = await aggregateSpeeches(m.uri, start!, end!);

		const datesHouseAttended = [
			...votes.datesHouseVoted,
			...speeches.datesHouseSpoke,
			...questions.datesOQsAsked,
		];
		const datesCommitteeAttended = [
			...votes.datesCommitteeVoted,
			...speeches.datesCommitteeSpoke,
		];

		// Array of dates where contributions made
		// Set used to avoid duplicates
		let present: Set<String> = new Set();

		for (let d of datesHouseAttended) {
			if (house.chamber == 'dail') {
				present.add(d.toDateString());

				// Adds any additional unaccounted for sittings
				for (let s of datesSitting.dailNotSitting) {
					if (d.toDateString() == s.toDateString()) {
						datesSitting.dailSitting.push(s);
					}
				}
			} else if (house.chamber == 'seanad') {
				for (let s of datesSitting.seanadNotSitting) {
					if (d.toDateString() == s.toDateString()) {
						datesSitting.seanadSitting.push(s);
					}
				}
			}
		}
		let record: participationRecord = {
			name: m.fullName,
			uri: m.uri,
			members: [m.uri],
			house: house.chamber,
			houseNo: house.houseNo,
			houseContributed: present.size,
			noHouseContribution: 0,
			houseVotes: votes.houseVotes,
			houseSpeeches: speeches.houseSpeeches,
			oralQuestions: questions.oralQuestions,
			writtenQuestions: questions.writtenQuestions,
		};

		records.push(record);

		console.log(
			`${m.fullName} has been successfully completed at ${new Date()}`
		);
	}

	const dailSitting: Set<String> = new Set();

	for (let ds of datesSitting.dailSitting) {
		dailSitting.add(ds.toDateString());
	}

	for (let r of records) {
		r.noHouseContribution = dailSitting.size - r.houseContributed;
	}

	console.log(`Completed at ${new Date()}`);

	return records;
}
