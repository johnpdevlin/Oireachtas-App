/** @format */
import aggregateVotes from './Member/votes';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import fetchVotes from '@/Functions/API-Calls/OireachtasAPI/votes';
import aggregateQuestions from './Member/questions';
import aggregateSpeeches from './Member/speeches';
import fetchHouses from '@/Functions/API-Calls/OireachtasAPI/houses';

export async function aggregateMemberRecords(
	members: RawFormattedMember[],
	start: string,
	end: string | undefined
) {
	const house = members[0].house.houseCode;
	const houseNo = members[0].house.houseNo;

	console.log(`Aggregating ${house} ${houseNo} records`);

	const records: {}[] = [];

	const houseDetails = fetchHouses({
		chamber_id: house,
		house_no: houseNo,
		limit: 5000,
	});

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
		// Clause for members who didn't serve for full session
		let tempStart = start;
		let tempEnd = end;
		let tempRawHouseVotes = rawHouseVotes;
		let tempRawCommitteeVotes = rawCommitteeVotes;
		if (m.dateRange.start != start || m.dateRange.end != end) {
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
		const houseVotes = await aggregateVotes({
			member: m.uri,
			rawVotes: tempRawHouseVotes,
		});

		const committeeVotes = await aggregateVotes({
			member: m.uri,
			rawVotes: tempRawCommitteeVotes,
		});

		const questions = await aggregateQuestions(m.uri, tempStart, tempEnd!);
		const speeches = await aggregateSpeeches(m.uri, tempStart, tempEnd!);

		const record = {
			member: m.uri,
			houseVotes: houseVotes,
			committeeVotes: committeeVotes,
			questions: questions,
			houseSpeeches: speeches.house,
			committeeSpeeches: speeches.committee,
		};

		console.log(record);
		records.push(record);
	}
	console.log(`Completed ${house} ${houseNo} Aggregation \n at ${new Date()}`);

	return records;
}
