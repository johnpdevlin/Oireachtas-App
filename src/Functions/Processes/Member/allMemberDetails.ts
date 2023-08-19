/** @format */

import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import parseMemberDetails from './Oireachtas/API/MemberDetails';
import fetchNames from '@/Functions/API-Calls/IrishNamesAPI/fetchNames';
import processTDwikiData from './Wiki/Dail/parseDataBySession';
import { processAllCommitteeInfo } from '../Committee/allCommitteesInfo';
import { MemberURI } from '@/Models/_utility';
import parseCommitteeMemberDetails from './Oireachtas/Website/parseCommittee';
import { Committee } from '@/Models/committee';
import { MemberCommittee } from '@/Models/DB/Member/committee';
import bindCommittees2Members from './Bind/Committees2Members';
import scrapeMemberOirProfile from '@/Functions/GetWebsiteData/Oireachtas/Member/scrapeMemberProfile';

type MemberCommitteeDetail = {
	uri: MemberURI;
	committee: MemberCommittee;
};
export default async function processAllMemberDetails() {
	const members = await fetchMembers({ house_no: 33 });

	const boyNames = (await fetchNames('boy')) as Record<number, string>;
	const girlNames = (await fetchNames('girl')) as Record<number, string>;

	const wikiDetails = await Promise.all(await processTDwikiData(33));

	console.log(wikiDetails);
	console.info(
		'Parsing member details from API, scraping data from Oireachtas and Wikipedia website...'
	);
	// Formats member data from Oireachtas API and website
	const formatted = await Promise.all(
		members.map(async (mem) => {
			const memberWiki = wikiDetails.find(
				(wiki) =>
					wiki.wikiURI.includes(mem.firstName) &&
					wiki.wikiURI.includes(mem.lastName)
			);
			const apiData = await parseMemberDetails(mem.uri, boyNames, girlNames);
			const profileData = await scrapeMemberOirProfile(mem.uri);
			return {
				...apiData,
				...profileData,
				...memberWiki,
			};
		}) as []
	);

	console.info('Done.');

	const committees = await processAllCommitteeInfo();
	const currentCommitteeMemberships: MemberCommitteeDetail[] = [];
	const pastCommitteeMemberships: MemberCommitteeDetail[] = [];
	committees.map((committee: Committee) => {
		const parsed = parseCommitteeMemberDetails(committee, 'dail');
		if (parsed?.current) currentCommitteeMemberships.push(...parsed.current);
		if (parsed?.past) pastCommitteeMemberships.push(...parsed.past);
	});

	const bound = bindCommittees2Members(
		currentCommitteeMemberships,
		pastCommitteeMemberships,
		formatted
	);

	console.log(bound);
}
