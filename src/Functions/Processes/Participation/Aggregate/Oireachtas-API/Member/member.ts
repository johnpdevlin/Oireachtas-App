/** @format */
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import fetchVotes from '@/Functions/API-Calls/OireachtasAPI/votes';
import { Chamber } from '@/Models/_utility';
import aggregateOirQuestions, { MemberQuestionAggregate } from './questions';
import aggregateOirSpeeches, { MemberSpeechAggregate } from './speeches';
import aggregateOirVotes, { MemberVoteAggregate } from './votes';

export type OirRecord = {
	member: string;
	houseVotes: MemberVoteAggregate[];
	committeeVotes: MemberVoteAggregate[];
	questions: {
		oralQuestions: MemberQuestionAggregate[] | undefined;
		writtenQuestions: MemberQuestionAggregate[] | undefined;
	};
	houseSpeeches: MemberSpeechAggregate[];
	committeeSpeeches: MemberSpeechAggregate[];
};

// aggregate records for members by day (ie count votes on a given day)
export async function aggregateMemberOirRecords(
	members: RawFormattedMember[],
	start: string,
	end: string | undefined
): Promise<OirRecord[]> {
	const house: Chamber = members[0].house.houseCode as Chamber;
	const houseNo = members[0].house.houseNo;

	console.log(
		`Aggregating ${house} ${houseNo} records for ${members.length} members`
	);

	// Array for all records
	const records: OirRecord[] = [];

	const rawHouseVotes = await fetchVotes({
		chamber_type: 'house',
		chamber: house,
		houseNo: houseNo,
		date_start: start,
		date_end: end,
	});

	const rawCommitteeVotes = await fetchVotes({
		chamber_type: 'committee',
		date_start: start,
		date_end: end,
	});

	for (let m of members) {
		// required variables to allow for incomplete sessions by members
		let tempStart = start;
		let tempEnd = end;
		let tempRawHouseVotes = rawHouseVotes;
		let tempRawCommitteeVotes = rawCommitteeVotes;
		if (m.dateRange.start != start || m.dateRange.end != end) {
			// Clause for members who didn't serve for full session
			tempStart = m.dateRange.start;
			tempEnd = m.dateRange.end!;
			tempRawHouseVotes = await fetchVotes({
				chamber_type: 'house',
				chamber: house,
				houseNo: houseNo,
				date_start: tempStart,
				date_end: tempEnd,
			});
			tempRawCommitteeVotes = await fetchVotes({
				chamber_type: 'committee',
				date_start: tempStart,
				date_end: tempEnd,
			});
		}

		// returns aggregated votes for member
		const houseVotes = await aggregateOirVotes({
			member: m.uri,
			rawVotes: tempRawHouseVotes,
		});

		const committeeVotes = await aggregateOirVotes({
			member: m.uri,
			rawVotes: tempRawCommitteeVotes,
		});

		const questions = await aggregateOirQuestions(m.uri, tempStart, tempEnd!);

		const speeches = await aggregateOirSpeeches(m.uri, tempStart, tempEnd!);

		const record: OirRecord = {
			member: m.uri,
			houseVotes: houseVotes,
			committeeVotes: committeeVotes,
			questions: questions,
			houseSpeeches: speeches.house,
			committeeSpeeches: speeches.committee,
		};

		records.push(record);
	}
	console.log(`Completed ${house} ${houseNo} Aggregation \n at ${new Date()}`);

	console.log(records.length + ' records aggregated');
	return records;
}
