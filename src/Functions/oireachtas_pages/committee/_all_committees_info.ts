/** @format */

import { Committee } from '@/models/committee';
import { scrapeCommitteePageInfo } from './committee_info';
import fetchMembers from '../../APIs/Oireachtas/member/raw/_member_details';
import { RawMember } from '@/models/oireachtasApi/member';
import scrapeCommitteesBaseDetails, { BaseCommittee } from './base_info';
import { formatRenamedCommittee } from './process/renamed_committee';

async function processAllCommitteeInfo(): Promise<Committee[]> {
	console.info('Retrieving all committee info...');

	// Get base details
	const allCommitteesBaseDetails = await scrapeCommitteesBaseDetails();
	const rawMembers = (await fetchMembers({})) as RawMember[];

	const committees: Committee[] = [];
	for (const committeeDetail of allCommitteesBaseDetails) {
		try {
			// Get full details, use base uri and dailNo as reference
			const committeeInfo = await scrapeCommitteePageInfo(
				committeeDetail.dailNo,
				committeeDetail.uri,
				rawMembers
			);
			if (committeeInfo) {
				committees.push(committeeInfo);
			} else {
				console.error(
					'Issue with committee scraping, object not returned successfully:',
					committeeDetail.uri
				);
			}
		} catch (error) {
			console.error(
				'Error in processing committee:',
				committeeDetail.uri,
				error
			);
		}
	}

	const processedCommittees = handleRenamedCommittees(committees);

	console.info('Committee scraping process complete.');
	return processedCommittees;
}

// Handles cases where committee has been renamed
// Webpage does not show members, so must be taken from successor page
function handleRenamedCommittees(committees: Committee[]) {
	const updatedCommittees = committees
		.filter((com) => com.successorUrl!)
		.map((rc) => {
			const matched = committees.find((com) => com.url === rc.successorUrl);
			return formatRenamedCommittee(rc, matched!);
		});

	// Replace renamed committees with updated members
	const allCommittees = committees.map((com) => {
		const updated = updatedCommittees.find((upc) => upc.uri === com.uri);
		if (updated!) return updated;
		else return com;
	});

	return allCommittees;
}

export default processAllCommitteeInfo;
