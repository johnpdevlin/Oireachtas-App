/** @format */
import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import { DebateRecord } from '@/Models/OireachtasAPI/debate';

type MemberSpeechAggregate = {
	uri: string;
	chamberType: string;
	house: string;
	houseNo: number;
	date: string;
	committeeCode?: string;
	speechCount: number;
};

function parseSpeeches(debates: DebateRecord[]): MemberSpeechAggregate[] {
	const memberSpeeches: MemberSpeechAggregate[] = [];
	const aggregatedSpeeches: { [key: string]: MemberSpeechAggregate } = {};

	debates.forEach((deb: DebateRecord) => {
		const { date, house } = deb;
		const committeeCode = house.committeeCode || '';

		// Create a unique key for each debate using relevant properties
		const debKey = `${date}-${house.chamberType}-${house.houseNo}${
			committeeCode ? '-' + committeeCode : ''
		}`;

		// Extract the member code of the speaker
		const speaker = deb.debateSections.speakers.memberCode;

		if (!aggregatedSpeeches[debKey]) {
			// Initialize a new aggregate object for the debate if it doesn't exist
			const speeches: MemberSpeechAggregate = {
				uri: speaker,
				house: house.houseCode,
				chamberType: house.chamberType,
				houseNo: parseInt(house.houseNo),
				date,
				...(committeeCode ? { committeeCode } : {}),
				speechCount: 0,
			};
			aggregatedSpeeches[debKey] = speeches;
		}

		const speechCount = deb.counts.contributorCount;
		aggregatedSpeeches[debKey].speechCount += speechCount;
	});

	// Extract the values from the aggregatedSpeeches object
	memberSpeeches.push(...Object.values(aggregatedSpeeches));

	return memberSpeeches;
}

export default async function aggregateSpeeches(
	member: string,
	start: string,
	end: string
): Promise<{
	committee: MemberSpeechAggregate[];
	house: MemberSpeechAggregate[];
}> {
	const rawCommitteeSpeeches = fetchDebates({
		member: member,
		date_start: start,
		date_end: end,
		chamber_type: 'committee',
	});

	const rawHouseSpeeches = fetchDebates({
		member: member,
		date_start: start,
		date_end: end,
		chamber_type: 'house',
		chamber_id: 'dail',
	});

	const committeeSpeeches = parseSpeeches(await rawCommitteeSpeeches);
	const houseSpeeches = parseSpeeches(await rawHouseSpeeches);
	return { committee: committeeSpeeches, house: houseSpeeches };
}
