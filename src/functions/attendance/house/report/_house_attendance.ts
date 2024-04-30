/** @format */
import { BinaryChamber, URIpair } from '@/models/_utils';
import parseSittingDaysPDF from './parse_attendance_report';
import { SittingDaysRecord } from '@/models/attendance';
import fetchMembers from '../../../APIs/Oireachtas/member/raw/_member_details';
import reportURLs from '@/Data/attendance-reports-URLs.json';
import { matchMemberURIsToReports } from './match_reports_to_uri';
import { RawMember } from '@/models/oireachtas_api/member';

// Function to scrape sitting reports for a specific chamber and legislative term
async function processSittingReportsByTerm(
	chamber: BinaryChamber,
	house_no: number,
	membersData?: RawMember[]
): Promise<SittingDaysRecord[]> {
	try {
		// Fethces Reports and members data
		// Matches Member to Report
		const reports = await fetchReports(chamber, house_no);
		if (!reports.length) return [];

		if (!membersData) membersData = await fetchMembers({ chamber, house_no });

		const members = parseRelevantMemberData(membersData!);

		return matchMemberURIsToReports(reports, members);
	} catch (error) {
		console.error('Error fetching or processing member data:', error);
		return [];
	}
}

async function fetchReports(
	chamber: string,
	house_no: number
): Promise<SittingDaysRecord[]> {
	// Use config file to get relevant reports
	const reportsConfig =
		reportURLs.find(
			(config) => config.chamber === chamber && config.term === house_no
		)?.reports || [];
	if (!reportsConfig.length) return [];

	return (
		await Promise.allSettled(
			reportsConfig.map((report) => parseSittingDaysPDF(report.url))
		)
	)
		.filter((result) => result.status === 'fulfilled')
		.map(
			(result) => (result as PromiseFulfilledResult<SittingDaysRecord[]>).value
		)
		.flat();
}

function parseRelevantMemberData(data: RawMember[]): URIpair[] {
	return data.map(({ lastName, firstName, memberCode }) => ({
		name: `${lastName} ${firstName}`.toLowerCase(),
		uri: memberCode,
	}));
}

export { processSittingReportsByTerm };
