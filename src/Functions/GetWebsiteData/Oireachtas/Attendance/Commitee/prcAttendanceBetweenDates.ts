/** @format */

import { dateToYMDstring, getDateTwoWeeksAgo } from '@/Functions/Util/dates';
import processCommitteeReportsBetweenDates from './prcReportsBetweenDates';

/** @format */
export default async function processCommitteeAttendanceBetweenDates(
	date_start: string,
	date_end?: string
) {
	const twoWeeksPast = getDateTwoWeeksAgo();

	if (!date_start) return [];
	if (!date_end || new Date(date_end!).getTime() > twoWeeksPast)
		// To allow time for pdfs to be uploaded
		date_end = dateToYMDstring(new Date(twoWeeksPast));

	const processedRecords = await processCommitteeReportsBetweenDates(
		date_start,
		date_end
	);

	console.log(processedRecords);

	// ascertain tds and senators
	// OR ignore senators
	// remove committee on from uri aside from where standing
	// Deal with inconsistent uris by dates

	// function mergeCommitteeAttendanceRecords(committees: Promise<Committee | void>[], reports: CommitteeAttendance[]){
	// 	// iterate over committees
	// 	// filter relevant records
	// 	//
	// 	// check if dates overlap with past members
	// 	//

	// 	const memberRecords = [];
	// 	for (const com of committees){
	// 		const committeeRecords = reports.filter(rep  => com.committee_uri === rep.committee_uri)
	// 		const memberRecords = committeeRecords.map((cr) =>{
	// 			const date  = cr.date;

	// 			const present = cr.attendees.map((a) => {
	// 				const member = com.currentMembers.find(c => c a);
	// 			})
	// 		})
	// 	}

	// }

	// async function assignUriToAttendance(
	// 	reports: Promise<CommitteeAttendance[]>[],
	// 	committeeMembers: string,
	// 	members: { name: string; uri: string }[]
	// ){

	// 	const processedReports = [];

	// 	for (const report of reports) {
	// 		let bestMatch: { name: string; uri: string } | undefined;
	// 		let maxSimilarity = 0;

	// 		// Find the best match for each report
	// 		for (const member of members) {
	// 			const similarityScore = similarity.compareTwoStrings(
	// 				report.name!.toLowerCase(), // Compare lowercase report name
	// 				member.name.toLowerCase() // Compare lowercase member name
	// 			);

	// 			// Keep track of the best match so far
	// 			if (similarityScore > maxSimilarity) {
	// 				maxSimilarity = similarityScore;
	// 				bestMatch = member;
	// 			}
	// 		}

	// 		if (bestMatch) {
	// 			const { name, ...rest } = report;
	// 			const processedReport = {
	// 				...rest,
	// 				uri: bestMatch.uri, // Assign the best match URI to the report
	// 			};
	// 			processedReports.push(processedReport);
	// 		}
	// 	}

	// 	return processedReports;
	// }
}
