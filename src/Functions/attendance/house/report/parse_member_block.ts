/** @format */

import { convertDMYdate2YMD } from '@/functions/_utils/dates';
import { splitStringIntoLines } from '@/functions/_utils/strings';
import { SittingDays } from '@/models/attendance';
import { parseBeforeDates } from './parse_member_before_dates';

function parseMemberBlock(block: string): SittingDays | undefined {
	// splits into lines and removes empty lines
	const lines = splitStringIntoLines(block);

	// obj to be reassigned
	let report: SittingDays = initialiseReport();

	let searchingDates = false;

	for (let i = lines.length; i >= 0; --i) {
		if (lines[i]) {
			if (searchingDates === false) {
				const parsed = parseBeforeDates(report, lines, i);
				report = parsed.report;
				i = parsed.newIndex;
				searchingDates = parsed.searchingDates;
			} else if (searchingDates === true) {
				if (lines[i].includes('*')) {
					// end condition on pdf
					searchingDates = false;
				} else {
					report = parseSittingDates(lines, i, report);
				}
			}
		}
	}

	if (isReportConsistent(report)) return report;
	else logParsingError(report);
}

function parseSittingDates(
	lines: string[],
	i: number,
	report: SittingDays
): SittingDays {
	if (lines[i].length === 10) {
		// where one date on same line
		// which array to push to must be inferred
		const date = convertDMYdate2YMD(lines[i]); // format date
		if (report.sittingTotal > report.otherTotal) report.sittingDates.push(date);
		else if (report.otherTotal > report.sittingTotal)
			report.otherDates.push(date);
	} else if (lines[i].length === 20) {
		// where two dates on the same line
		const sittingDate = convertDMYdate2YMD(lines[i].slice(0, 10));
		const otherDate = convertDMYdate2YMD(lines[i].slice(10));
		report.sittingDates.push(sittingDate);
		report.otherDates.push(otherDate);
	}
	report.year = new Date(report.sittingDates[0]!).getFullYear();
	return report;
}

function initialiseReport() {
	return {
		name: '',
		dateRange: {
			start: new Date(),
			end: new Date(),
		},
		limit: 0,
		totalPossibleSittings: 0,
		sittingDates: [],
		otherDates: [],
		sittingTotal: 0,
		otherTotal: 0,
		total: 0,
		percentage: 0,
		year: 0,
	};
}

export function isReportConsistent(report: SittingDays): boolean {
	return (
		report.sittingDates.length === report.sittingTotal &&
		report.otherDates.length === report.otherTotal
	);
}

function logParsingError(report: SittingDays): void {
	console.warn(
		`${report.name} has not been parsed correctly: \n`,
		`Date Range: ${report.dateRange.start} to ${report.dateRange.end}, \n`,
		`Total: ${report.total}, Other Dates: ${report.otherDates.length}, \n`,
		`Other Total: ${report.otherTotal}, Sitting Dates: ${report.sittingDates.length}, \n`,
		`Sitting Total: ${report.sittingTotal}`
	);
}

export default parseMemberBlock;
