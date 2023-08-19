/** @format */

import fetchNames from '@/Functions/APIs/IrishNames/fetchNames';
import { MemberURI } from '@/Models/_util';
import getAllMembersAPIdetails from '@/Functions/APIs/Oireachtas/Member/Get/Formatted/Multi_MemberDetails';
import getAllMembersOirData from '@/Functions/ScrapeWebsites/Oireachtas/Member/Get/AllData/multi_members';
import { WikiProfileDetails } from '@/Models/Scraped/Wiki/member';
import { OirData } from '@/Models/Scraped/Oireachtas/member';
import { MemberAPIdetails } from '@/Models/OireachtasAPI/Formatted/Member/member';
import getTDsWikiData from '@/Functions/ScrapeWebsites/Wikipedia/TD/Page/multi_TDpage';
import similarity from 'string-similarity';
import checkGender from '@/Functions/APIs/IrishNames';

/**
 * Fetches all member data
 * Merges and returns
 **/
export default async function getAllMemberDetails() {
	console.info('Process to get all member details begun...');

	const apiData = (await getAllMembersAPIdetails(undefined, {
		house_no: 33,
	})) as MemberAPIdetails[];
	const uris = apiData!.map((member: { uri: MemberURI }) => member.uri);
	const oirData = await getAllMembersOirData(uris!);
	const wikiDetails = await getTDsWikiData(33);
	const mergedData = await bindAllData(uris, oirData, wikiDetails, apiData);

	console.log(mergedData);

	console.info('Process to get all member details completed.');
}

async function bindAllData(
	uris: MemberURI[],
	oirData: OirData[],
	wikiData: WikiProfileDetails[],
	apiData: MemberAPIdetails[]
) {
	const boyNames = (await fetchNames('boy')) as Record<number, string>;
	const girlNames = (await fetchNames('girl')) as Record<number, string>;

	const bound = uris.map((uri: MemberURI) => {
		const api = apiData.find((data) => data.uri === uri);
		const oir = oirData.find((data: OirData) => data.uri === uri);
		let wiki = wikiData.find(
			(data: WikiProfileDetails) =>
				data.wikiURI.toLowerCase().includes(api!.lastName!.toLowerCase()) &&
				data.wikiURI.toLowerCase().includes(api!.firstName!.toLowerCase())
		);
		if (!wiki) {
			const fullName = api!.fullName.toLowerCase();
			const matches = similarity.findBestMatch(
				fullName,
				wikiData.map((data) => data.wikiURI.toLowerCase())
			);
			wiki = wikiData.find((w) => w.wikiURI === matches.bestMatch.target);
		}

		const gender = checkGender(
			api!.firstName.toLowerCase(),
			boyNames,
			girlNames
		);

		return {
			...oir,
			...wiki,
			...api,
			gender,
		};
	});
	return bound;
}
