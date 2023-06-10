/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import scrapeCommitteeInfo from '@/Functions/GetWebsiteData/Oireachtas/scapeCommitteeInfo';
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from '@/Functions/GetWebsiteData/Oireachtas/scrapeAllCommittees';
export default async function prcCommittee() {
	const committees: BaseCommittee[] = await scrapeCommitteesBaseDetails();

	const co1 = scrapeCommitteeInfo(33, committees[0].uri);
	console.log(co1);

	return;
}
