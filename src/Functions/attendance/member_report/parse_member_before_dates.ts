/** @format */

import { convertDMYdate2YMD } from '@/functions/_utils/dates';
import { SittingDays } from '@/models/attendance';
import { isReportConsistent } from './parse_member_block';

// Extracts, limit, totals and date range
function parseBeforeDates(
	report: SittingDays,
	lines: string[],
	i: number
): { report: SittingDays; newIndex: number; searchingDates: boolean } {
	let searchingDates = false;
	if (report.sittingDates.length === 0) {
		const handledTotals = handleTotals(report, lines, i, searchingDates);
		report = handledTotals.report;
		searchingDates = handledTotals.searchingDates;
	} else if (report.sittingDates.length > 0) {
		if (lines[i].includes('Limit:')) {
			// Extracts the limit
			report = { ...report, ...extractLimit(lines, i) };
		} else if (lines[i].includes('Date Range')) {
			// Extracts the date range
			report.dateRange = extractDateRange(lines[i]);

			// calculate percentage of sittings attended
			report.percentage = report.sittingTotal / report.totalPossibleSittings;

			// Work around to deal with case where number characters are corrupted
			// issue with pdf or pdf extraction.
			if (report.sittingTotal + report.otherTotal !== report.total) {
				// where errors of total not being picked up
				const handledInconsistencies = handleInconsistentTotals(
					report,
					lines,
					i,
					searchingDates
				);
				report = handledInconsistencies.report;
				i = handledInconsistencies.newIndex;
				searchingDates = handledInconsistencies.searchingDates;
			}
		}
	}
	return { report, newIndex: i, searchingDates };
}

// extracts total and check for condition for searching
function handleTotals(
	report: SittingDays,
	lines: string[],
	i: number,
	searchingDates: boolean
): { report: SittingDays; searchingDates: boolean } {
	if (lines[i].startsWith('Sub-total')) {
		// Extracts the total number of sitting days and other days
		let [temp, sitting, other] = lines[i].split('Sub-total:');
		report.sittingTotal = parseInt(sitting);
		report.otherTotal = parseInt(other);
		searchingDates = true;
	} else if (
		report.totalPossibleSittings === 0 &&
		lines[i].includes('sitting days in the period')
	) {
		// Extracts the total number of sitting days in the period
		report.totalPossibleSittings = parseInt(lines[i].split('period')[1].trim());
	} else if (lines[i].includes('period')) {
		// find the total variable which is sittings + others
		if (!isNaN(parseInt(lines[i + 1]))) {
			report.total = parseInt(lines[i + 1]);
		} else if (!isNaN(parseInt(lines[i - 1]))) {
			report.total = parseInt(lines[i - 1]);
		}
	}

	return { report: report, searchingDates: searchingDates };
}

function handleInconsistentTotals(
	report: SittingDays,
	lines: string[],
	i: number,
	searchingDates: boolean
): { report: SittingDays; newIndex: number; searchingDates: boolean } {
	if (isReportConsistent(report)!)
		report.total = report.sittingTotal + report.otherTotal;
	else {
		// corrects for next iterations
		if (report.sittingTotal > report.otherTotal || !Number(report.otherTotal)) {
			report.otherTotal = report.total - report.sittingTotal;
		} else if (
			report.sittingTotal < report.otherTotal ||
			!Number(report.sittingTotal)
		) {
			report.sittingTotal = report.total - report.otherTotal;
		}

		// reset i which will be returned and used to search for dates with corrections
		i = lines.findIndex((line) => line.includes('Sub-total'));

		report.sittingDates = []; // resetting arrays
		report.otherDates = [];
		searchingDates = true; // allows to search for dates
	}
	return { report, newIndex: i, searchingDates };
}

function extractLimit(lines: string[], i: number) {
	return {
		name: lines[i - 1],
		limit: parseInt(lines[i].split('Limit:')[1].trim()),
	};
}

function extractDateRange(line: string): { start_date: Date; end_date: Date } {
	const dr = line.replace('Date Range', '').trim();
	const [start_date, end_date] = dr?.split(' to ');
	return {
		start_date: new Date(convertDMYdate2YMD(start_date)),
		end_date: new Date(convertDMYdate2YMD(end_date)),
	};
}

export { parseBeforeDates };
