/** @format */

import fetchNames from '../../APIs/Irish_Names/fetch_names_';

import getAllMembersAPIdetails from '../../APIs/Oireachtas/member/formatted/_multi_member_details';
import getAllMembersOirData from '@/functions/oireachtas_pages/td/get/all_data/multi_TDs';
import { WikiTDProfileDetails } from '@/models/wiki_td';
import { OirData } from '@/models/member';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import getTDsWikiData from '@/functions/wikipedia/td/page/multi_td_page';
import similarity from 'string-similarity';
import checkGender from '../../APIs/Irish_Names/index_';

// Consolidated Member Bio Data
export type MemberBioData = { gender: string | void } & OirData &
	WikiTDProfileDetails &
	MemberAPIdetails;

/**
 * Fetches all member data
 * Merges and returns
 **/
async function getAggregatedTDsDetailsByHouse(house_no: number) {
	console.info('Process to get all member details begun...');

	// Data directly from Oireachtas API
	const apiData = (await getAllMembersAPIdetails(undefined, {
		house_no: house_no,
	})) as MemberAPIdetails[];

	// Gets all URIs
	const uris = apiData!.map((member: { uri: string }) => member.uri);

	// Gets Data from Oireachtas Website profiles
	const oirData = await getAllMembersOirData(uris!);

	// Gets data from Wikipedia
	const wikiDetails = await getTDsWikiData(33);

	// Function to merge / bind all data together to create objects
	const mergedData = await bindAllData(uris, oirData, wikiDetails, apiData);

	console.info('Process to get all member details completed.');

	console.log(mergedData);
	return mergedData;
}

async function bindAllData(
	uris: string[],
	oirData: OirData[],
	wikiData: WikiTDProfileDetails[],
	apiData: MemberAPIdetails[]
): Promise<MemberBioData[]> {
	const boyNames = (await fetchNames('boy')) as Record<number, string>;
	const girlNames = (await fetchNames('girl')) as Record<number, string>;

	const bound = await Promise.all(
		// Iterate over each URI
		uris.map(async (uri: string) => {
			// Find TD API and OIR data by URI
			const api = apiData.find((data) => data.uri === uri);
			const oir = oirData.find((data: OirData) => data.uri === uri);

			// Find Wiki Data by name
			let wiki = wikiData.find(
				(data: WikiTDProfileDetails) =>
					data.wikiName!.toLowerCase().includes(api!.lastName!.toLowerCase()) &&
					data.wikiName!.toLowerCase().includes(api!.firstName!.toLowerCase())
			);

			// If no initial wiki data match by name
			if (!wiki) {
				const fullName = api!.fullName.toLowerCase();
				const matches = similarity.findBestMatch(
					fullName,
					wikiData.map((data) => data.wikiName!.toLowerCase())
				);
				wiki = wikiData.find((w) => w.wikiName === matches.bestMatch.target);
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

	return bound as MemberBioData[];
}

export default getAggregatedTDsDetailsByHouse;
