/** @format */

import { Vote } from '../../../../Models/UI/participation';

export default function formatVotes(
	votes: any[],
	member?: any
): Promise<Vote[]> {
	// Formats by removing unnecessary properties and passing into correct type interfaces
	const formattedVotes = async (): Promise<Vote[]> => {
		const vs = () => {
			const Vs = [];
			for (let v of votes) {
				// Check if committee exitsts before assigning
				const committeeCode = v.division.house.committeeCode
					? v.division.house.committeeCode
					: undefined;
				const committee = v.division.house.committeeCode
					? v.division.house.showAs
					: undefined;
				const voteNo = v.division.voteId.slice(5);
				const debateNo = v.division.debate.debateSection.slice(7);
				let voted: 'Tá' | 'Níl' | 'Staon' | undefined;
				if (member!) {
					voted = v.division.memberTally.showAs;
				}

				const vote: Vote = {
					house: v.division.house.houseCode,
					houseNo: v.division.house.houseNo,
					chamber: v.division.chamber,
					committee: committee,
					committeeUri: committeeCode,
					debate: v.division.debate.showAs,
					subject: v.division.subject.showAs,
					outcome: v.division.outcome,
					voted: voted!,
					tallies: {
						// must check for nulls and declare as 0 if exist
						yes: v.division.tallies.taVotes
							? v.division.tallies.taVotes.tally
							: 0,
						abstained: v.division.tallies.staonVotes
							? v.division.tallies.staonVotes.tally
							: 0,
						no: v.division.tallies.nilVotes
							? v.division.tallies.nilVotes.tally
							: 0,
					},
					timeStamp: v.division.datetime,
					voteId: v.division.voteId,
					debateSection: v.division.debate.debateSection,
					voteUrl: `https://www.oireachtas.ie/en/debates/vote/${v.division.house.houseCode}/${v.division.house.houseNo}/${v.contextDate}/${voteNo}/`,
					debateUrl: `https://www.oireachtas.ie/en/debates/debate/${v.division.house.houseCode}/${v.contextDate}/${debateNo}/`,
				};

				Vs.push(vote);
			}
			return Vs;
		};
		return vs();
	};

	return formattedVotes();
}
