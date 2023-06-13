/** @format */

import axios from 'axios';

type DateRange = {
	start_date: string;
	end_date: string;
};

type SittingDays = {
	name: string;
	dateRange: DateRange;
	limit: number;
	totalPossibleSittings: number;
	sittingDates: (string | undefined)[];
	otherDates: (string | undefined)[];
	sittingTotal: number;
	otherTotal: number;
};

export type SittingDaysReport = {
	url: string;
	year: number;
} & SittingDays;

function parseBlock(block: string): SittingDays {
	const lines = block
		.split('\n')
		.filter((line) => line !== undefined && line.length > 0);

	// variables to be reassigned
	let totalPossibleSittings: number = 0;
	let sittingTotal: number = 0;
	let otherTotal: number = 0;
	let sittingDates: string[] = [];
	let limit: number = 0;
	let otherDates: string[] = [];
	let searchingDates: boolean = false;
	let dateRange: DateRange = { start_date: '', end_date: '' };
	let name: string = '';
	let report: SittingDays;

	for (let i = lines.length; i >= 0; --i) {
		if (lines[i]) {
			if (!searchingDates) {
				if (sittingDates.length === 0) {
					if (
						totalPossibleSittings === 0 &&
						lines[i].includes('sitting days in the period')
					) {
						totalPossibleSittings = parseInt(
							lines[i].split('period')[1].trim()
						);
					}
					if (lines[i].startsWith('Sub-total')) {
						// Gets total number of sitting days and other days as per documentation
						let [temp, sitting, other] = lines[i].split('Sub-total: ');
						sittingTotal = parseInt(sitting);
						otherTotal = parseInt(other);
						searchingDates = true;
					}
				} else if (sittingDates.length > 0) {
					if (lines[i].includes('Limit:')) {
						limit = parseInt(lines[i].split('Limit:')[1].trim());
						name = lines[i - 1];
					} else if (lines[i].includes('Date Range')) {
						const dr = lines[i].replace('Date Range', '').trim();
						const [start_date, end_date] = dr?.split(' to ');
						dateRange = { start_date, end_date };

						report = {
							name,
							dateRange,
							limit,
							totalPossibleSittings,
							sittingDates,
							otherDates,
							sittingTotal,
							otherTotal,
						};
					}
				}
			} else if (searchingDates === true) {
				if (lines[i].includes('*')) {
					searchingDates = false;
				} else if (lines[i].length === 10) {
					if (sittingTotal > otherTotal) {
						sittingDates.push(lines[i]);
					} else if (otherTotal > sittingTotal) {
						otherDates.push(lines[i]);
					}
				} else if (lines[i].length === 20) {
					const sittingDate = lines[i].slice(0, 10);
					const otherDate = lines[i].slice(10);
					sittingDates.push(sittingDate);
					otherDates.push(otherDate);
				}
			}
		}
	}
	if (!report) return;

	return report;
}

export default async function parseSittingDaysReport(
	url: string
): Promise<SittingDaysReport[]> {
	return axios
		.get(`api/pdf2text?url=${url}`)
		.then((response) => {
			const matches = url.match(/\/(\d{4})\//);
			const year = matches && matches[1];
			const text = response.data.text;

			const blocks = text.split('Member Sitting Days Report');

			const reports: SittingDaysReport[] = blocks
				.map((block: string) => {
					const parsed = parseBlock(block);
					if (parsed) {
						return { ...parsed, url: url, year: parseInt(year!) };
					}
				})
				.filter((rep: SittingDaysReport) => rep !== undefined);

			return reports;
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			return [];
		});
}
