/** @format */
/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import { Chamber } from '@/Models/_utility';

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
		date_start: start,
		date_end: end,
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
