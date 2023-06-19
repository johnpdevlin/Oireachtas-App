/** @format */
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

export default async function aggregateSpeeches(
	debates: DebateRecord[]
): Promise<MemberSpeechAggregate[]> {
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
