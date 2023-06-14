/** @format */

import fetchVotes from '@/Functions/API-Calls/OireachtasAPI/votes';
import { RawVote } from '@/Models/OireachtasAPI/vote';
import { Chamber } from '@/Models/_utility';
import { DayVotes } from '@/Models/participation';
import { ChamberType } from '../../../../../Models/_utility';

export default async function aggregateVotes(props: {
	member: string;
	start?: string | Date;
	end?: string | Date;
	chamber?: string;
	chamberType?: string;
}) {
	const voteRecords = [];

	const votes: RawVote[] = await fetchVotes({
		member_id: props.member,
		date_start: props.start,
		date_end: props.end,
	});

	let selectedDate: Date | undefined = undefined;
	let committeeUri: string = '';
	let chamber = '';
	let chamberType = '';
	let houseCode = '';

	let houseVotes = 0;
	let committeeVotes = 0;
	// need to do something to ensure no duplicates?
	// vote ID?
	for (let v of votes) {
		let date = new Date(v.date);
		chamber = v.house.houseCode;
		chamberType = v.house.chamberType;

		if (v.house.chamberType === 'committee') {
			committeeUri = v.house.uri;
			committeeVotes++;
		} else if (chamberType === 'house') {
			committeeUri = '';
			houseVotes++;
		}

		if (selectedDate !== date) {
			if (selectedDate !== undefined) {
				voteRecords.push({
					date: selectedDate,
					chamber: chamber,
					chamberType: chamberType,
					date: selectedDate,
					houseVotes: houseVotes,
					committeeVotes: committeeVotes,
					committeeUri: committeeUri,
				});
			}
			selectedDate = date;
		}
	}

	console.log(voteRecords);
	// let houseVotes: number = 0; // counter variables
	// let committeeVotes: number = 0;
	// let lastHDate: Date = new Date('1900-01-01');
	// let lastCDate: Date = new Date('1900-01-01');

	// // parses out individual dates
	// for (let v of votes) {
	// 	const date: Date = new Date(v.contextDate);
	// 	if (v.division.house.chamberType == 'house') {
	// 		if (date.getTime() !== lastHDate.getTime()) {
	// 			datesHouseVoted.push(date);
	// 			lastHDate = date;
	// 		}
	// 		houseVotes++;
	// 	}
	// 	if (v.division.house.chamberType == 'committee') {
	// 		if (date.getTime() !== lastCDate.getTime()) {
	// 			datesCommitteeVoted.push(date);
	// 			lastCDate = date;
	// 		}
	// 		committeeVotes++;
	// 	}
	// }

	// return { houseVotes, committeeVotes, datesCommitteeVoted, datesHouseVoted };
}
