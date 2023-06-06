/** @format */

import fetchVotes from '../../../Fetcher/OireachtasAPI/votes';

export default async function aggregateVotes(
	member: string,
	start: Date,
	end: Date,
	chamber?: string,
	chamberType?: string
): Promise<{
	houseVotes: number;
	committeeVotes: number;
	datesCommitteeVoted: Date[];
	datesHouseVoted: Date[];
}> {
	const datesHouseVoted: Date[] = []; // array of unique dates
	const datesCommitteeVoted: Date[] = []; // array of unique dates

	const votes = await fetchVotes({
		member: member,
		date: start,
		dateEnd: end,
		formatted: false,
	});

	let houseVotes: number = 0; // counter variables
	let committeeVotes: number = 0;
	let lastHDate: Date = new Date('1900-01-01');
	let lastCDate: Date = new Date('1900-01-01');

	// parses out individual dates
	for (let v of votes) {
		const date: Date = new Date(v.contextDate);
		if (v.division.house.chamberType == 'house') {
			if (date.getTime() !== lastHDate.getTime()) {
				datesHouseVoted.push(date);
				lastHDate = date;
			}
			houseVotes++;
		}
		if (v.division.house.chamberType == 'committee') {
			if (date.getTime() !== lastCDate.getTime()) {
				datesCommitteeVoted.push(date);
				lastCDate = date;
			}
			committeeVotes++;
		}
	}

	return { houseVotes, committeeVotes, datesCommitteeVoted, datesHouseVoted };
}
