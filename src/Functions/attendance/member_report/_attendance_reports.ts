/** @format */

import { BinaryChamber } from '@/models/_utils';
import parseSittingDaysPDF from './parse_attendance_report';
import { SittingDaysRecord } from '@/models/attendance';
import fetchMembers from '../../APIs/Oireachtas/member/raw/_member_details';
import reportURLs from '@/Data/attendance-reports-URLs.json';
import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';

// Function to scrape sitting reports for a specific chamber and legislative term
async function processSittingReportsByTerm(
	chamber: BinaryChamber,
	houseNo: number
): Promise<SittingDaysRecord[]> {
	const reportsConfig =
		reportURLs.find(
			(config) => config.chamber === chamber && config.term === houseNo
		)?.reports || [];
	if (!reportsConfig.length) return [];

	const reports = (
		await Promise.allSettled(
			reportsConfig.map((report) => parseSittingDaysPDF(report.url))
		)
	)
		.filter((result) => result.status === 'fulfilled')
		.map(
			(result) => (result as PromiseFulfilledResult<SittingDaysRecord[]>).value
		)
		.flat();

	if (!reports.length) return [];

	try {
		const membersData = await fetchMembers({ chamber, house_no: houseNo });

		const members = membersData!.map(
			({ lastName, firstName, memberCode, memberships }) => ({
				name: `${lastName} ${firstName}`.toLowerCase(),
				uri: memberCode,
				houseCode: memberships[0].membership.house.houseCode,
			})
		);

		return assignMemberURIsToReports(reports, members);
	} catch (error) {
		console.error('Error fetching or processing member data:', error);
		return [];
	}
}

// Function to assign member URIs to each report based on the best name match
async function assignMemberURIsToReports(
	reports: SittingDaysRecord[],
	memberData: { name: string; uri: string; houseCode: string }[]
): Promise<SittingDaysRecord[]> {
	const reportNames = reports.map((report) => report.name!).filter(Boolean);

	const { matches, unMatchedURIs } = assignMemberURIsAndNames(
		reportNames,
		memberData
	);

	const matchedReports = reports.map((report) => {
		const match = matches.find(
			(m) => m.name.toLowerCase() === report.name!.toLowerCase()
		);
		return match ? { ...report, uri: match.uri } : report;
	});

	return matchedReports.filter((report) => report.uri! && report.uri !== '');
}

export default processSittingReportsByTerm;
