/** @format */

import fetchNames from '@/functions/APIs_/Irish_Names_/fetch_names_';
import { MemberURI } from '@/models/_utils';
import getAllMembersAPIdetails from '@/functions/APIs_/Oireachtas_/member_/get_/formatted_/multi_member_details_';
import getAllMembersOirData from '@/functions/scrape_websites/oireachtas/member/get/all_data/multi_members';
import { WikiProfileDetails } from '@/models/scraped/wiki/member';
import { OirData } from '@/models/scraped/oireachtas/member';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import getTDsWikiData from '@/functions/scrape_websites/wikipedia/td/page/multi_td_page';
import similarity from 'string-similarity';
import checkGender from '@/functions/APIs_/Irish_Names_';

/**
 * Fetches all member data
 * Merges and returns
 **/
export default async function getAllMemberDetails() {
	console.info('Process to get all member details begun...');

	// Data directly from Oireachtas API
	const apiData = (await getAllMembersAPIdetails(undefined, {
		house_no: 33,
	})) as MemberAPIdetails[];

	// Gets all URIs
	const uris = apiData!.map((member: { uri: MemberURI }) => member.uri);

	// Gets Data from Oireachtas Website profiles
	const oirData = await getAllMembersOirData(uris!);

	// Gets data from Wikipedia
	const wikiDetails = await getTDsWikiData(33);

	// Function to merge / bind all data together to create objects
	const mergedData = await bindAllData(uris, oirData, wikiDetails, apiData);

	console.info('Process to get all member details completed.');

	return mergedData;
}

async function bindAllData(
	uris: MemberURI[],
	oirData: OirData[],
	wikiData: WikiProfileDetails[],
	apiData: MemberAPIdetails[]
) {
	const boyNames = (await fetchNames('boy')) as Record<number, string>;
	const girlNames = (await fetchNames('girl')) as Record<number, string>;

	const bound = await Promise.all(
		// Iterate over each URI
		uris.map(async (uri: MemberURI) => {
			// Find TD API and OIR data by URI
			const api = apiData.find((data) => data.uri === uri);
			const oir = oirData.find((data: OirData) => data.uri === uri);

			// Find Wiki Data by name
			let wiki = wikiData.find(
				(data: WikiProfileDetails) =>
					data.wikiURI.toLowerCase().includes(api!.lastName!.toLowerCase()) &&
					data.wikiURI.toLowerCase().includes(api!.firstName!.toLowerCase())
			);

			// If no initial wiki data match by name
			if (!wiki) {
				const fullName = api!.fullName.toLowerCase();
				const matches = similarity.findBestMatch(
					fullName,
					wikiData.map((data) => data.wikiURI.toLowerCase())
				);
				wiki = wikiData.find((w) => w.wikiURI === matches.bestMatch.target);
			}

			// Get gender by name match
			const gender = await checkGender(
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
		})
	);
	return bound;
}
