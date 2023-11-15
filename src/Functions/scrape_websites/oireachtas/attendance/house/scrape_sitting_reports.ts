/** @format */

import { BinaryChamber, Chamber } from '@/models/_utils';
import similarity from 'string-similarity';
import parseSittingDaysPDF from './parse_sitting_days_pdf';
import { RawMember } from '@/models/oireachtasApi/member';
import { SittingDaysReport } from '@/models/scraped/attendanceReport';
import fetchMembers from '@/functions/APIs_/Oireachtas_/member_/get_/raw_/get';
import reportURLs from '@/Data/attendanceReportsURLs.json';

// Scrape sitting reports for a specific chamber and house number
export default async function scrapeSittingReportsForChamber(
	chamber: BinaryChamber,
	house_no: number
): Promise<SittingDaysReport[]> {
	// Get urls from internal data reference point
	const urls = reportURLs
		.find((item) => item.chamber === chamber && item.term === house_no)!
		.reports.map((item) => {
			return item.url;
		}) as string[];

	if (urls.length === 0) return [];

	// Parse each report URL
	const reports = urls.map((report) => {
		return parseSittingDaysPDF(report);
	});

	// Get members and extract member names and URIs
	const members = (await fetchMembers({
		house_no: house_no,
		chamber: chamber,
	}))!.map((member: RawMember) => {
		const name = `${member.lastName} ${member.firstName}`;
		return { name: name, uri: member.uri };
	});

	// Assign URIs to the reports
	const parsedReports = await assignUriToReports(reports, members!);

	return parsedReports;
}

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
