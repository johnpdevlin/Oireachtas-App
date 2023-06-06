/** @format */
/** @format */

import fetchDebates from '../../../Fetcher/OireachtasAPI/debates';
import { member } from '../../../Models/UI/member';

export default async function aggregateSpeeches(
	member: string,
	start: Date,
	end: Date
): Promise<{
	houseSpeeches: number;
	committeeSpeeches: number;
	datesHouseSpoke: Date[];
	datesCommitteeSpoke: Date[];
}> {
	// :
	// Promise<{ totalVotes: number; datesVoted: Date[] }>

	const debates = await fetchDebates({
		member: member,
		date: start,
		dateEnd: end,
		formatted: false,
	});

	let datesHouseSpoke: Date[] = []; // array of unique dates
	let datesCommitteeSpoke: Date[] = []; // array of unique dates
	let houseSpeeches: number = 0; // houseSpeeches counter
	let committeeSpeeches: number = 0; // committeeSpeeches counter
	let lastHDate: Date = new Date('1900-01-01');
	let lastCDate: Date = new Date('1900-01-01');

	// parses out individual dates
	// parses out house and committee, increments counts
	for (let d of debates) {
		const date: Date = new Date(d.contextDate);
		if (d.debateRecord.house.chamberType == 'house') {
			if (date.getTime() !== lastHDate.getTime()) {
				datesHouseSpoke.push(date);
				lastHDate = date;
			}
			houseSpeeches++;
		} else if (d.debateRecord.house.chamberType == 'committee') {
			if (date.getTime() !== lastCDate.getTime()) {
				datesCommitteeSpoke.push(date);
				lastCDate = date;
			}
			committeeSpeeches++;
		}
	}

	return {
		houseSpeeches,
		committeeSpeeches,
		datesHouseSpoke,
		datesCommitteeSpoke,
	};
}
