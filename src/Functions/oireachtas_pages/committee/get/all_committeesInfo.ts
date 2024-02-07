/** @format */

import { Committee } from '@/models/scraped/oireachtas/committee';
import { scrapeCommitteePageInfo } from './committeeInfo';
import fetchMembers from '../../../APIs/Oireachtas_/member_/get_/raw_/get';
import { RawMember } from '@/models/oireachtasApi/member';
import scrapeCommitteesBaseDetails, { BaseCommittee } from './base_info';

export default async function processAllCommitteeInfo(): Promise<Committee[]> {
	console.log('Scraping data for all committees has begun.');

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

	console.log('Committee scraping process complete.');
	return committees;
}
