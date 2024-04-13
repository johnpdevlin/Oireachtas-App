/** @format */

import fetchNames from '../../APIs/Irish_Names/fetch_names';
import getAllMembersAPIdetails from '../../APIs/Oireachtas/member/formatted/_multi_member_details';
import getAllMembersOirData from '@/functions/oireachtas_pages/td/multi_TDs';
import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';
import getTDsWikiData from '@/functions/wikipedia_pages/td/page/multi_td_page';
import similarity from 'string-similarity';
import checkGender from '../../APIs/Irish_Names/_index';
import { MemberOirProfileData } from '@/models/member/oir_profile';
import { WikiMemberProfileDetails } from '@/models/member/wiki_profile';
import { AllMemberBioData } from '@/models/member/_all_bio_data';

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
	console.info(
		'Member data retrieved, parsed and processed from Oireachtas API.'
	);

	// Gets Data from Oireachtas Website profiles
	const oirData = await getAllMembersOirData(uris!);
	console.info(
		'Member data scraped, parsed and processed from Oireachtas website.'
	);

	// Gets data from Wikipedia
	const wikiDetails = await getTDsWikiData(33);
	console.info(
		'Member data scraped, parsed and processed from Wikipedia profile.'
	);

	// Function to merge / bind all data together to create objects
	const mergedData = await bindAllData(
		house_no,
		uris,
		oirData,
		wikiDetails,
		apiData
	);

	console.info('Process to get all member details completed.');

	return mergedData;
}

async function bindAllData(
	house_no: number,
	uris: string[],
	oirData: MemberOirProfileData[],
	wikiData: WikiMemberProfileDetails[],
	apiData: MemberAPIdetails[]
): Promise<AllMemberBioData[]> {
	const boyNames = await fetchNames('boy');
	const girlNames = await fetchNames('girl');

	const bound = await Promise.all(
		// Iterate over each URI
		uris.map(async (uri: string) => {
			// Find TD API and OIR data by URI
			const api = apiData.find((data) => data.uri === uri);
			const oir = oirData.find((data) => data.uri === uri);

			// Find Wiki Data by name
			let wiki = wikiData.find(
				(data: WikiMemberProfileDetails) =>
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
			let gender = await checkGender(
				api!.firstName,
				boyNames,
				girlNames,
				'dail',
				house_no
			);

			const websites = () => {
				const wikipedia = {
					website: 'wikipedia',
					url: `https://en.wikipedia.org${wiki?.wikiURI}`,
				};
				const oireachtas = {
					website: 'oireachtas',
					url: `https://www.oireachtas.ie/en/members/member/${oir?.uri}`,
				};
				const webpages = oir!.webpages.map((w) => {
					if (isParty(w.website!)) return { website: 'party', url: w.url };
					else return w;
				});
				return [...webpages, wikipedia, oireachtas];
			};

			return {
				...oir,
				...wiki,
				...api,
				webpages: websites(),
				gender,
			};
		})
	);

	return bound as AllMemberBioData[];
}

const isParty = (website: string): boolean => {
	const possibleParties = [
		'sinnfein',
		'finegael',
		'fiannafail',
		'pbp',
		'greenparty',
		'labour',
		'socialdemocrats',
		'letusrise',
		'solidarity',
		'independentireland',
		'aontu',
		'righttochange',
		'hdalliance',
		'anrabhartaglas',
		'wuag',
		'workersparty',
		'republicansinnfein',
	];
	if (possibleParties.includes(website)) return true;
	else return false;
};
export default getAggregatedTDsDetailsByHouse;
