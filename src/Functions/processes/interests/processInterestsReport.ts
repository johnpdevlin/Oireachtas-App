/** @format */

import parseInterestsReport from '@/functions/documents/interests/register/_parse_interests_pdf';

export function processInterestsReports(url: string) {
	const parsedReports = parseInterestsReport(url);
}
