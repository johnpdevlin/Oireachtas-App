/** @format */

import fetchDebates from '../API-Calls/OireachtasAPI/debates';
import fetchQuestions from '../API-Calls/OireachtasAPI/questions';
import fetchVotes from '../API-Calls/OireachtasAPI/votes';

async function checkOireachtasSitting(date: Date) {
	// Checks if chambers were sitting on given date
	let dailSitting = false;
	let seanadSitting = false;
	// let committeeSitting = false;
	// const committeesSitting: { uri: string; name: string }[] = [];

	const debates = await fetchDebates({
		date: date,
		dateEnd: date,
		formatted: false,
		limit: 10000,
	});

	// checks if speeches made on given date
	if (debates.length > 0) {
		for (let d of debates) {
			// check avoids repitition
			// where date has already been determined to be a sitting
			if (
				!dailSitting ||
				!seanadSitting
				// || committeeSitting
			) {
				// if (d.debateRecord.house.chamberType == 'committee') {
				// 	committeeSitting = true;
				// 	committeesSitting.push({
				// 		uri: d.debateRecord.house.committeeCode,
				// 		name: d.debateRecord.house.showAs,
				// 	});
				// }

				// checks if instance of debate is dail or seanad
				if (d.debateRecord.house.houseCode == 'dail') {
					dailSitting = true;
				} else if (d.debateRecord.house.houseCode == 'seanad') {
					seanadSitting = true;
				}
			} else {
				// if sitting determined, breaks out of loop
				break;
			}
		}
	}

	// checks if votes made on given date
	if (
		!dailSitting ||
		!seanadSitting
		// || committeeSitting == false
	) {
		const votes = await fetchVotes({
			start_date: date,
			end_date: date,
			limit: 10000,
		});

		if (votes.length > 0) {
			for (let v of votes) {
				// check avoids repitition
				// where date has already been determined to be a sitting
				if (
					!dailSitting ||
					!seanadSitting
					// || committeeSitting == false
				) {
					// if (v.division.house.chamberType == 'committee') {
					// 	committeeSitting = true;
					// 	committeesSitting.push({
					// 		uri: v.division.house.committeeCode,
					// 		name: v.division.house.showAs,
					// 	});
					// }
					// checks if instance of vote is dail or seanad
					if (v.division.house.houseCode == 'dail') {
						dailSitting = true;
					} else if (v.division.house.houseCode == 'seanad') {
						seanadSitting = true;
					}
				} else {
					break;
				}
			}
		}
	}

	if (!dailSitting) {
		// questions only  made by tds,
		// so relates only to dáil
		const questions = await fetchQuestions({
			limit: 1,
			date_start: date,
			formatted: false,
		});

		if (questions.length > 0) {
			for (let q of questions) {
				if (q.question.questionType == 'oral') {
					dailSitting = true;
				}
			}
		}
	}

	return {
		dailSitting,
		seanadSitting,
		// committeeSitting,
		// committeesSitting,
	};
}

export default async function checkDatesSitting(dates: Date[]): Promise<{
	dailSitting: Date[];
	dailNotSitting: Date[];
	seanadSitting: Date[];
	seanadNotSitting: Date[];
}> {
	// arrays to hold dates
	const dailSitting: Date[] = [];
	const dailNotSitting: Date[] = [];
	const seanadSitting: Date[] = [];
	const seanadNotSitting: Date[] = [];
	// const committees: Set<string> = new Set();
	// const committeesSitting: {
	// 	name: string;
	// 	uri: string;
	// 	datesSitting: Date[];
	// 	notSitting: Date[];
	// }[] = [];

	for (let d of dates) {
		// loops through dates to retrieve records of dates houses sat
		const s = await checkOireachtasSitting(d);

		if (s.dailSitting == true) {
			dailSitting.push(d);
		} else if (s.dailSitting == false) {
			dailNotSitting.push(d);
		}

		if (s.seanadSitting == true) {
			seanadSitting.push(d);
		} else if (s.seanadSitting == false) {
			seanadNotSitting.push(d);
		}

		// if (s.committeeSitting == true) {
		// 	for (let c of s.committeesSitting) {
		// 		committees.add(c.uri);
		// 		committeesSitting.push({c.name, c.uri, datesSitting});
		// 	}
		// 	// console.log(s.committeesSitting);
		// 	// committees.push(s.committeesSitting.uri);
		// 	// committeesSitting.push({name: s.committeesSittingname, uri: s.uri, datesSitting: });
		// }
		// // else{

		// // }
	}

	console.log(
		`Dates checked... 
		\nDates: ${dates.length} 
		\ndailSitting: ${dailSitting.length} 
		\ndailNotSitting: ${dailNotSitting.length}
		\nseanadSitting: ${seanadSitting.length} 
		\nseanadNotSitting: ${seanadNotSitting.length}`
	);

	return { dailSitting, dailNotSitting, seanadSitting, seanadNotSitting };
}
