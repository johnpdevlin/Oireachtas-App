/** @format */
import { QuestionAnswer } from '@mui/icons-material';
import { format } from 'date-fns';
import fetcher from '../Fetcher';
import fetchDebates from '../Fetcher/OireachtasAPI/debates';
import fetchQuestions from '../Fetcher/OireachtasAPI/questions';
import fetchVotes from '../Fetcher/OireachtasAPI/votes';

export default async function checkOireachtasSitting(date: Date) {
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
			date: date,
			dateEnd: date,
			formatted: false,
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
			date: date,
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
