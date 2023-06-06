/** @format */
import fetchDebates from '../Fetcher/OireachtasAPI/debates';
import fetchQuestions from '../Fetcher/OireachtasAPI/questions';
import fetchVotes from '../Fetcher/OireachtasAPI/votes';
import { Question } from '../Models/UI/participation';

export default async function checkParticipation(
	member: string,
	houseVotes: Promise<any[]>,
	debates: Promise<any[]>,
	oralQuestions?: Promise<any[]>,
	writtenQuestions?: Promise<any[]>
) {
	// Check if TD present and count instances of votes, spoken questions, contributions
	let houseSpeeches = 0;
	let totalWrittenQuestions: number = 0;
	let totalOralQuestions: number = 0;
	let totalHouseVotes: number = 0;
	let houseVotesMissed: number = 0;
	let housePresent: boolean;

	for (let d of await debates) {
		houseSpeeches += d.debateRecord.debateSections.length;
	}

	for (let h of await houseVotes) {
		const nos = h.division.tallies.nilVotes.members;
		const yesses = h.division.tallies.taVotes.members;
		const abstained = h.division.tallies.staonVotes
			? h.division.tallies.staonVotes.tally.length
			: 0;
		const vs = [...nos!, ...yesses!];

		let count = 0;
		for (let v of vs) {
			if (v.member.memberCode == member) {
				totalHouseVotes++;

				break;
			}
			if (count == vs.length - 1) {
				houseVotesMissed++;
			}
			count++;
		}
		if (abstained! > 0) {
			for (let a of abstained) {
				if (a.member.memberCode == member) {
					totalHouseVotes++;

					break;
				}
				if (count == abstained.length - 1) {
					houseVotesMissed++;
				}
				count++;
			}
		}
	}

	if (oralQuestions && writtenQuestions) {
		for (let w of await writtenQuestions) {
			if ((await w.question.by.memberCode) == member) {
				totalWrittenQuestions++;
			}
		}
		for (let o of await oralQuestions) {
			if ((await o.question.by.memberCode) == member) {
				totalOralQuestions++;
			}
		}
	}

	// If records returned, deemed as present
	houseSpeeches > 0 || totalHouseVotes > 0 || totalOralQuestions > 0
		? (housePresent = true)
		: (housePresent = false);

	return {
		housePresent: housePresent,
		houseVotesMissed: houseVotesMissed,
		houseVotes: totalHouseVotes,
		houseSpeeches: houseSpeeches,
		oralQuestions: totalOralQuestions,
		writtenQuestions: totalWrittenQuestions,
	};
}
