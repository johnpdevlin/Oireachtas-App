/** @format */

import { RawVote } from '@/Models/OireachtasAPI/vote';

type Tally = {
	tally: number;
	members: {
		member: {
			memberCode: string;
			uri: string;
			showAs: string;
		};
	}[];
	showAs: string;
};

export type MemberVoteAggregate = {
	uri: string;
	house: string;
	houseNo: number;
	date: string;
	committeeCode?: string;
	votesCount: number;
	votesMissedCount: number;
};

// Returns array of objects containing amount of votes made and missed per day
// If committee and multiple, multiple day objects
export default async function aggregateOirVotes(props: {
	member: string;
	rawVotes: RawVote[];
}) {
	const parsedVotes = aggregateVotesByCommittee(props.rawVotes, props.member);

	return parsedVotes;
}

function aggregateVotesByCommittee(
	divisions: RawVote[],
	memberUri: string
): MemberVoteAggregate[] {
	const memberVotes: MemberVoteAggregate[] = [];
	const aggregatedVotes: { [key: string]: MemberVoteAggregate } = {};

	divisions.forEach((division) => {
		const { date, tallies, house } = division;
		const { nilVotes, taVotes, staonVotes } = tallies;
		const committeeCode = house.committeeCode || '';

		// Generate a unique key for each division based on date and if applicable committeeCode
		const divisionKey = `${date}-${committeeCode == '' ? '' : committeeCode}`;

		if (!aggregatedVotes[divisionKey]) {
			// If the aggregatedVotes object doesn't have a matching key, create a new MemberVoteAggregate object
			const votes: MemberVoteAggregate = {
				uri: memberUri,
				house: house.houseCode,
				houseNo: parseInt(house.houseNo),
				date,
				...(committeeCode == '' ? {} : { committeeCode }),
				votesCount: 0,
				votesMissedCount: 0,
			};

			// Store the memberVotes object in the aggregatedVotes object using the divisionKey as the key
			aggregatedVotes[divisionKey] = votes;
		}

		const votes = aggregatedVotes[divisionKey];

		// Check if the member has voted in any of the tallies and update the vote count accordingly
		if (
			hasMemberVoted(nilVotes, memberUri) === true ||
			hasMemberVoted(taVotes, memberUri) === true ||
			hasMemberVoted(staonVotes, memberUri) === true
		) {
			votes.votesCount++;
		} else {
			votes.votesMissedCount++;
		}
	});

	// Push all the aggregated votes into the memberVotes array and return it
	memberVotes.push(...Object.values(aggregatedVotes));

	return memberVotes;
}

function hasMemberVoted(tally: Tally | null, memberUri: string): boolean {
	if (!tally) {
		return false;
	}

	// Check if the member URI is present in the members array of the tally
	return tally.members.some(({ member }) => member.memberCode === memberUri);
}
