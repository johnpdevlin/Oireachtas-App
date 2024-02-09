/** @format */

import { Committee } from '@/models/committee';
import { scrapeCommitteePageInfo } from './committeeInfo';
import fetchMembers from '../../APIs/Oireachtas/member/raw/_member_details';
import { RawMember } from '@/models/oireachtasApi/member';
import scrapeCommitteesBaseDetails, { BaseCommittee } from './base_info';

async function processAllCommitteeInfo(): Promise<Committee[]> {
	const allCommitteesBaseDetails = await scrapeCommitteesBaseDetails();
	const rawMembers = (await fetchMembers({})) as RawMember[];

	const committees: Committee[] = [];
	for (const committeeDetail of allCommitteesBaseDetails) {
		try {
			const committeeInfo = await scrapeCommitteePageInfo(
				committeeDetail.dailNo,
				committeeDetail.uri,
				rawMembers
			);
			if (committeeInfo) {
				committees.push(committeeInfo);
			} else {
				console.error('Issue with committee scraping:', committeeDetail.uri);
			}
		} catch (error) {
			console.error(
				'Error in processing committee:',
				committeeDetail.uri,
				error
			);
		}
	}

	console.info('Committee scraping process complete.');
	return committees;
}

export default processAllCommitteeInfo;
