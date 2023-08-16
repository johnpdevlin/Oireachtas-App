/** @format */

import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import scrapeCommitteesBaseDetails from '@/Functions/GetWebsiteData/Oireachtas/Committee/WebPage/baseDetails';
import { RawFormattedMember } from '../../../Models/OireachtasAPI/member';
import { removeOuterObjects } from '@/Functions/Util/objects';
import fetcher from '@/Functions/API-Calls/fetcher';
import parseMemberDetails from './Oireachtas/API/parseMemberDetails';
import fetchNames from '@/Functions/API-Calls/IrishNamesAPI/fetchNames';

export default async function processAllMemberDetails() {
	const committees = scrapeCommitteesBaseDetails();
	const members = await fetchMembers({ house_no: 33 });

	const boyNames = (await fetchNames('boy')) as Record<number, string>;
	const girlNames = (await fetchNames('girl')) as Record<number, string>;

	const formatted = members.map(async (member) => {
		parseMemberDetails(member.uri, boyNames, girlNames);
	});
}
