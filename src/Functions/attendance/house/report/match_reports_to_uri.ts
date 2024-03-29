/** @format */

import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';
import { normaliseString } from '@/functions/_utils/strings';
import { SittingDaysRecord } from '@/models/attendance';
import { groupObjectsByProperty } from '../../../_utils/objects';
import { URIpair } from '@/models/_utils';

type MemberData = {
	name?: string;
	fullName: string;
	firstName: string;
	lastName: string;
	uri: string;
	house_code: string;
};

// Function to assign member URIs to each report based on the best name match
async function matchMemberURIsToReports(
	reports: SittingDaysRecord[],
	memberData: URIpair[]
): Promise<SittingDaysRecord[]> {
	const reportNames = reports.map((report) => report.name!);

	let { matches, unMatched } = assignMemberURIsAndNames(
		reportNames,
		memberData!
	);

	unMatched = unMatched.filter((um) => um! && um !== '');
	if (unMatched.length > 0) console.info('unmatched: ', unMatched.join(', '));

	const matchedReports: SittingDaysRecord[] = [];
	const unMatchedReports: SittingDaysRecord[] = [];

	reports.forEach((report) => {
		const match = matches.find(
			(m) => m.name!.toLowerCase() === report.name!.toLowerCase()
		);

		if (match!) {
			const { name, uri } = match;
			matchedReports.push({
				...report,
				name: name,
				uri: uri,
			});
		}
		// If not matched, other startegy tried
		else if (!match && report.name! !== '') {
			const name = normaliseString(report.name!);
			const matched = assignMemberURIsAndNames([name], memberData);
			if (matched.matches.length === 1) {
				const { name, uri } = matched.matches[0];
				matchedReports.push({
					...report,
					name: name,
					uri: uri,
				});
			} else if (matched.matches.length > 1) console.info(matched.matches);
			else unMatchedReports.push(report);
		}
	});

	if (unMatchedReports.length > 0) console.info(unMatchedReports);

	logMembersNotAppearing(matchedReports, memberData);
	return matchedReports;
}

function logMembersNotAppearing(
	reports: SittingDaysRecord[],
	members: URIpair[]
): void {
	const yearGrouped = groupObjectsByProperty(reports, 'year');
	members.forEach((member) => {
		yearGrouped.forEach((report) => {
			if (report.every((re) => re.uri !== member.uri)) {
				console.info(
					`Attendance record for ${member.uri} not found for ${report[0].year}`
				);
			}
		});
	});
}

export { matchMemberURIsToReports };
