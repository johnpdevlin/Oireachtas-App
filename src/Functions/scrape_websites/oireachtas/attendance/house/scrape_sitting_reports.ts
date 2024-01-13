/** @format */

import { BinaryChamber } from '@/models/_utils';
import similarity from 'string-similarity';
import parseSittingDaysPDF from './parse_sitting_days_pdf';
import { SittingDaysReport } from '@/models/scraped/attendance';
import fetchMembers from '@/functions/APIs/Oireachtas_/member_/get_/raw_/get';
import reportURLs from '@/Data/attendance-reports-URLs.json';

// Function to scrape sitting reports for a specific chamber and legislative term
export default async function scrapeSittingReportsForChamber(
	chamber: BinaryChamber,
	house_no: number
): Promise<SittingDaysReport[]> {
	// Retrieve URLs for sitting reports based on chamber and house number
	const reportEntries =
		reportURLs.find(
			(item) => item.chamber === chamber && item.term === house_no
		)?.reports || [];
	if (!reportEntries.length) return [];

	// Fetch and parse all report PDFs in parallel
	const reportArrays = await Promise.all(
		reportEntries.map((entry) => parseSittingDaysPDF(entry.url))
	);
	const reports = reportArrays.flat();

	let members;
	try {
		// Fetch member data and transform it for later use
		members =
			(await fetchMembers({ house_no, chamber }))?.map(
				({ lastName, firstName, memberCode }) => ({
					name: `${lastName} ${firstName}`.toLowerCase(), // To match pattern of name scraped from report
					uri: memberCode,
				})
			) ?? [];

		// Throw error if no members are found
		if (!members.length) throw new Error('No members found.');
	} catch (error) {
		console.error('Error fetching members:', error);
		return [];
	}

	// Assign member URIs to reports based on name similarity
	return await assignUriToReports(reports, members);
}

// Function to assign member URIs to each report based on the best name match
async function assignUriToReports(
	reports: SittingDaysReport[],
	members: { name: string; uri: string }[]
): Promise<SittingDaysReport[]> {
	const processedReports: SittingDaysReport[] = [];

	// Process each report to find the best member match based on name similarity
	for (const report of reports) {
		const bestMatch = findBestMatchMember(report.name, members);
		if (bestMatch) {
			// Append the best match member URI to the report
			processedReports.push({ ...report, uri: bestMatch.uri });
		}
	}

	return processedReports;
}

// Helper function to find the member with the name most similar to the report name
function findBestMatchMember(
	reportName: string | undefined,
	members: { name: string; uri: string }[]
) {
	if (!reportName) return undefined;
	let bestMatch: { name: string; uri: string } | undefined;
	let maxSimilarity = 0;

	// Iterate through each member to find the one whose name is most similar to the report name
	for (const member of members) {
		const similarityScore = similarity.compareTwoStrings(
			reportName.toLowerCase(),
			member.name
		);
		if (similarityScore > maxSimilarity) {
			maxSimilarity = similarityScore;
			bestMatch = member;
		}
	}

	return bestMatch;
}
