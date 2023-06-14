/** @format */

export async function aggregateMemberRecords(
	members: Promise<member[]>,
	house: 'dail' | 'seanad',
	houseNo: number,
	tallies: {
		present: string[];
		absent: string[];
		oralQuestions: string[];
		writtenQuestions: string[];
		houseVotes: string[];
	}
) {
	const aggregatedMemberRecords: participationRecord[] = []; // Array to hold records to be returned

	for (let m of await members) {
		let pr: participationRecord = {
			name: m.fullName,
			uri: m.uri,
			house: house,
			houseNo: houseNo,
			members: [m.uri],
			housePresent: 0,
			houseAbsent: 0,
			houseSpeeches: 0,
			houseVotes: 0,
			houseVotesMissed: 0,
		};

		const records = await getMemberDateRecords({
			uri: m.uri,
			session: houseNo,
		});

		for (let r of await records) {
			if (r.housePresent == false) {
				pr.houseAbsent++;
				pr.houseVotesMissed += r.houseVotesMissed;
			} else {
				pr.housePresent++;
				pr.houseSpeeches += r.houseSpeeches;
				pr.houseVotes += r.houseVotes;
				pr.houseVotesMissed += r.houseVotesMissed;
				if (
					house != 'seanad' &&
					(pr.writtenQuestions! && pr.oralQuestions!) != NaN
				) {
					pr.writtenQuestions += r.writtenQuestions;
					pr.oralQuestions += r.oralQuestions;
				}
			}
		}
		console.log(
			`${m.fullName} has been successfully completed at ${Date.now()}`
		);
		aggregatedMemberRecords.push(pr);
	}
	console.log(`Completed at ${new Date()}`);
	return aggregatedMemberRecords;
}
