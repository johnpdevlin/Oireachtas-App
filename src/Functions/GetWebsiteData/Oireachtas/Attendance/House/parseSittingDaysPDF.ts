/** @format */

import {
	SittingDays,
	SittingDaysReport,
} from '@/Models/Scraped/attendanceReport';
import axios from 'axios';
import { convertDMYdate2YMD } from '../../../../Util/dates';
import he from 'he';

export default async function parseSittingDaysPDF(
	url: string
): Promise<SittingDaysReport[]> {
	return axios
		.get(`api/pdf2text?url=${url}`)
		.then((response) => {
			const matches = url.match(/\/(\d{4})\//);
			const year = matches && matches[1]; // finds year
			const text = he.decode(response.data.text);

			// split by delimiter
			const blocks = text.split('Member Sitting Days Report');

			const reports: SittingDaysReport[] = blocks
				.map((block: string) => {
					const parsed = parseBlock(block);
					if (typeof parsed === 'string') {
						console.warn('the following block may need investigated:', parsed); // a sort of error message
					} else if (parsed) {
						// Constructs the SittingDaysReport object for each block
						return { ...parsed, url: url, year: parseInt(year!) };
					}
				})
				.filter(Boolean);

			return reports;
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			return [];
		});
}

function parseBlock(block: string): SittingDays | string {
	// splits into lines and removes empty lines
	const lines = block
		.split('\n')
		.filter((line) => line !== undefined && line.length > 0);

	// obj to be reassigned
	let report: SittingDays = {
		name: '',
		dateRange: {
			start_date: new Date(),
			end_date: new Date(),
		},
		limit: 0,
		totalPossibleSittings: 0,
		sittingDates: [],
		otherDates: [],
		sittingTotal: 0,
		otherTotal: 0,
		total: 0,
		percentage: 0,
	};

	let searchingDates = false;

	for (let i = lines.length; i >= 0; --i) {
		if (lines[i]) {
			if (!searchingDates) {
				if (report.sittingDates.length === 0) {
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
						report.totalPossibleSittings = parseInt(
							lines[i].split('period')[1].trim()
						);
					} else if (lines[i].includes('period')) {
						// find the total variable which is sittings + others
						if (!isNaN(parseInt(lines[i + 1]))) {
							report.total = parseInt(lines[i + 1]);
						} else if (!isNaN(parseInt(lines[i - 1]))) {
							report.total = parseInt(lines[i - 1]);
						}
					}
				} else if (report.sittingDates.length > 0) {
					if (lines[i].includes('Limit:')) {
						// Extracts the limit
						report.limit = parseInt(lines[i].split('Limit:')[1].trim());
						report.name = lines[i - 1];
					} else if (lines[i].includes('Date Range')) {
						// Extracts the date range
						const dr = lines[i].replace('Date Range', '').trim();
						const [start_date, end_date] = dr?.split(' to ');

						report.dateRange = {
							start_date: new Date(convertDMYdate2YMD(start_date)),
							end_date: new Date(convertDMYdate2YMD(end_date)),
						};

						// calculate percentage of sittings attended
						report.percentage =
							report.sittingTotal / report.totalPossibleSittings;

						if (report.sittingTotal + report.otherTotal !== report.total) {
							// Work around to deal with case where number characters are corrupted
							// issue with pdf or pdf extraction.
							// otherwise will iterations will END.
							if (
								report.sittingTotal === report.sittingDates.length &&
								report.otherTotal === report.otherDates.length
							) {
								// where errors of total not being picked up
								report.total = report.sittingTotal + report.otherTotal;
							} else {
								console.warn(
									report.name,
									' should be checked that all dates are correct for period',
									report.dateRange,
									'total: ',
									report.total,
									'other total: ',
									report.otherTotal,
									'sitting total: ',
									report.sittingTotal,
									'otherDates: ',
									report.otherDates.length,
									'sittingDates: ',
									report.sittingDates.length
								);

								// corrects for next iterations
								if (report.sittingTotal > report.otherTotal) {
									report.otherTotal = report.total - report.sittingTotal;
								} else if (report.sittingTotal < report.otherTotal) {
									report.sittingTotal = report.total - report.otherTotal;
								}

								// resets i to search for dates with corrections
								i = lines.findIndex((line) => line.includes('Sub-total'));
								report.sittingDates = []; // resetting arrays
								report.otherDates = [];
								searchingDates = true; // allows to search for dates
							}
						}
						// END OF ITERATIONS
						break;
					}
				}
			} else if (searchingDates === true) {
				if (lines[i].includes('*')) {
					// end condition on pdf
					searchingDates = false;
				} else if (lines[i].length === 10) {
					// where one date on same line
					// which array to push to must be inferred

					const date = convertDMYdate2YMD(lines[i]); // format date
					if (report.sittingTotal > report.otherTotal) {
						report.sittingDates.push(date);
					} else if (report.otherTotal > report.sittingTotal) {
						report.otherDates.push(date);
					}
				} else if (lines[i].length === 20) {
					// where two dates on the same line
					const sittingDate = convertDMYdate2YMD(lines[i].slice(0, 10));
					const otherDate = convertDMYdate2YMD(lines[i].slice(10));
					report.sittingDates.push(sittingDate);
					report.otherDates.push(otherDate);
				}
			}
		}
	}

	return report;
}
