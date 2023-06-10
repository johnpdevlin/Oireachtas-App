/** @format */

import fetchDebates from '@/Functions/API-Calls/OireachtasAPI/debates';
import parseCommitteeReport from '@/Functions/GetWebsiteData/Oireachtas/parseCommitteeReport';
import scrapeCommitteeInfo from '@/Functions/GetWebsiteData/Oireachtas/scapeCommitteeInfo';
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from '@/Functions/GetWebsiteData/Oireachtas/scrapeAllCommittees';
import { capitaliseFirstLetters } from '@/Functions/Util/strings';
import ListItem from '@mui/material/ListItem';
export default async function prcCommittee() {
	// const committees: BaseCommittee[] = await scrapeCommitteesBaseDetails();

	// const co1 = scrapeCommitteeInfo(33, committees[0].uri);
	// console.log(co1);

	const debates = fetchDebates({
		date_start: '2020-11-01',
		date_end: '2020-12-01',
		chamber_type: 'committee',
	});

	const records = (await debates).map((deb) => {
		const date = new Date(deb.contextDate);
		const name = capitaliseFirstLetters(
			deb.debateRecord.house.showAs.toLowerCase()
		);
		const uri = deb.debateRecord.house.committeeCode;
		let pdf, xml;
		if (deb.debateRecord.formats.pdf) {
			pdf = deb.debateRecord.formats.pdf.uri;
		}
		if (deb.debateRecord.formats.xml) {
			xml = deb.debateRecord.formats.xml.uri;
		}
		return {
			date,
			name,
			uri,
			pdf,
			xml,
		};
	});

	// const parsedRecords = records.map((r) => {
	// 	if (r.pdf !== undefined) {
	// 		const att = parseCommitteeReport(r.pdf);
	// 		return { ...r, att };
	// 	}
	// });

	const parsedRecords = records.map((r) => {
		const att = parseCommitteeReport(r.pdf);
		return { ...r, att };
	});
	console.log(parsedRecords);

	return parsedRecords;
}
