/** @format */

import { Chamber } from '@/Models/_utility';
import similarity from 'string-similarity';
import parseSittingDaysReport, {
	SittingDaysReport,
} from './parseSittingDaysPDF';
import fetchMembers, {
	Member,
} from '@/Functions/API-Calls/OireachtasAPI/members';

// Assign URIs to the reports
async function assignUriToReports(
	reports: Promise<SittingDaysReport[]>[],
	members: { name: string; uri: string }[]
): Promise<SittingDaysReport[]> {
	const resolvedReports = await Promise.all(reports);
	const mergedReports = resolvedReports.flat();
	const processedReports: SittingDaysReport[] = [];

	for (const report of mergedReports) {
		let bestMatch: { name: string; uri: string } | undefined;
		let maxSimilarity = 0;

		// Find the best match for each report
		for (const member of members) {
			const similarityScore = similarity.compareTwoStrings(
				report.name!.toLowerCase(), // Compare lowercase report name
				member.name.toLowerCase() // Compare lowercase member name
			);

			// Keep track of the best match so far
			if (similarityScore > maxSimilarity) {
				maxSimilarity = similarityScore;
				bestMatch = member;
			}
		}

		if (bestMatch) {
			const { name, ...rest } = report;
			const processedReport = {
				...rest,
				uri: bestMatch.uri, // Assign the best match URI to the report
			};
			processedReports.push(processedReport);
		}
	}

	return processedReports;
}

// Scrape sitting reports for a specific chamber and house number
export default async function scrapeSittingReportsForChamber(
	chamber: Chamber,
	house_no: number
): Promise<SittingDaysReport[]> {
	let reportURLs: string[] = [];

	if (chamber === 'dail') {
		if (house_no === 33) {
			// Define report URLs for house number 33
			let report2020 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2021/2021-02-12_deputies-verification-of-attendance-for-the-payment-of-taa-8-feb-to-30-nov-2020_en.pdf';
			let report2021 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2022/2022-03-10_deputies-verification-of-attendance-for-the-payment-of-taa-01-jan-2021-to-31-december-2021_en.pdf';
			let report2022 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2023/2023-03-13_deputies-verification-of-attendance-for-the-payment-of-taa-01-january-2022-to-31-december-2022_en.pdf';
			reportURLs = [report2020, report2021, report2022];
		}
	}

	if (reportURLs.length === 0) return [];

	const reports = reportURLs.map((report) => {
		return parseSittingDaysReport(report); // Parse each report URL
	});

	const members = (
		await fetchMembers({
			house_no: house_no,
			chamber: chamber,
		})
	).map((member: Member) => {
		const name = `${member.lastName} ${member.firstName}`;
		return { name: name, uri: member.memberCode }; // Extract member name and URI
	});

	const parsedReports = await assignUriToReports(reports, members); // Assign URIs to the reports

	return parsedReports;
}
