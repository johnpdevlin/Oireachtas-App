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

type SittingDaysReport = {
	url: string;
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
	let record: SittingDays;

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

						record = {
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
	if (!record) return;

	return record;
}

export default async function parseSittingDaysReport(
	url: string
): Promise<SittingDaysReport[]> {
	return axios
		.get(`api/pdf2text?url=${url}`)
		.then((response) => {
			const text = response.data.text;

			const blocks = text.split('Member Sitting Days Report');

			const records: SittingDaysReport[] = blocks
				.map((block: string) => {
					const parsed = parseBlock(block);
					if (parsed) {
						return { ...parsed, url: url };
					}
				})
				.filter((rep: SittingDaysReport) => rep !== undefined);

			console.log(records);
			return records;
			// let dateRange: DateRange;
			// let name: string;
			// let limit: number;
			// let totalPossibleSittings: number;
			// let sittingDates: (string | undefined)[] = [];
			// let otherDates: (string | undefined)[] = [];
			// let sittingTotal: number = 0;
			// let otherTotal: number = 0;
			// let searching = false;
			// const records: SittingDaysReport[] = [];
			// for (let i = 0; i < lines.length; i++) {
			// 	// more efficient to iterate backwards?
			// 	const line = lines[i];
			// 	if (!searching) {
			// 		if (line.includes('Member Sitting Days Report')) {
			// 			if (name !== undefined) {
			// 				records.push({
			// 					name,
			// 					dateRange,
			// 					limit,
			// 					totalPossibleSittings,
			// 					sittingDates,
			// 					otherDates,
			// 					sittingTotal,
			// 					otherTotal,
			// 					url,
			// 				});
			// 				name = '';
			// 				dateRange = { start_date: '', end_date: '' };
			// 				limit = 0;
			// 				totalPossibleSittings = 0;
			// 				sittingDates = [];
			// 				otherDates = [];
			// 			}
			// 		} else if (line.includes('Date Range')) {
			// 			const dr = line.replace('Date Range', '').trim();
			// 			const [start_date, end_date] = dr?.split(' to ');
			// 			dateRange = { start_date, end_date };
			// 			name = lines[i + 1];
			// 			if (name.length < 2) {
			// 				name += lines[i + 2];
			// 			}
			// 		} else if (line.includes('Limit:')) {
			// 			limit = parseInt(lines[3].split('Limit: ')[1], 10);
			// 		} else if (line.startsWith('Sub-total')) {
			// 			// Gets total number of sitting days and other days as per documentation
			// 			let [temp, sitting, other] = line.split('Sub-total: ');
			// 			sittingTotal = parseInt(sitting);
			// 			otherTotal = parseInt(other);
			// 			i = 4;
			// 		} else if (lines[i].includes('sitting days in the period')) {
			// 			totalPossibleSittings = parseInt(
			// 				lines[i].split('period')[1].trim()
			// 			);
			// 		} else if (
			// 			line.includes('*') &&
			// 			sittingTotal !== 0 &&
			// 			otherTotal !== 0
			// 		) {
			// 			searching = true;
			// 		} else if (lines[i].includes('sitting days in the period')) {
			// 			totalPossibleSittings = parseInt(
			// 				lines[i].split('period')[1].trim()
			// 			);
			// 			searching = false;
			// 		}
			// 	} else if (searching === true) {
			// 		if (line.includes('Sub-total')) {
			// 			searching = false;
			// 		} else if (line.length === 10) {
			// 			if (sittingTotal > otherTotal) {
			// 				sittingDates.push(line);
			// 			} else if (otherTotal > sittingTotal) {
			// 				otherDates.push(line);
			// 			}
			// 		} else if (line.length === 20) {
			// 			const sittingDate = line.slice(0, 10);
			// 			const otherDate = line.slice(10);
			// 			sittingDates.push(sittingDate);
			// 			otherDates.push(otherDate);
			// 		}
			// 	}
			// }
			// console.log(records);
			// return records;
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			return [];
		});
}

// 	for (let i = 5; i < lines.length; i++) {
// 		const line = lines[i].trim();
// 		if (line.startsWith('Total number of sitting days in the period')) {
// 			// Gets total number of sitting days and other days as per documentation
// 			isDatesLine = false;
// 			const sittings = line.split(
// 				'Total number of sitting days in the period: '
// 			);
// 			totalPossibleSittings = parseInt(sittings, 10);
// 		}
// 		if (line.startsWith('Sub-total')) {
// 			// Gets total number of sitting days and other days as per documentation
// 			isDatesLine = false;
// 			let [temp, sitting, other] = line.split('Sub-total: ');
// 			sittingTotal = parseInt(sitting, 10);
// 			otherTotal = parseInt(other, 10);
// 		}

// 		// Add member to array of member records
// 		// Find new member name and reset variables
// 		else if (line.startsWith('Date Range 01/01/2022 to 31/12/2022')) {
// 			memberRecords.push({
// 				dateRange,
// 				memberFirstName: firstName,
// 				memberLastName: lastName,
// 				memberName: name,
// 				limit,
// 				totalPossibleSittings,
// 				sittingDaysAttendanceRecorded,
// 				otherDaysAttendanceRecorded,
// 				url,
// 			});

// 			// reset variables for next member
// 			[lastName, firstName] = lines[i + 1].split(' ');
// 			name = `${firstName} ${lastName}`;
// 			sittingDaysAttendanceRecorded = [];
// 			otherDaysAttendanceRecorded = [];
// 			isDatesLine = true;
// 			sittingTotal = 0;
// 			otherTotal = 0;
// 		}

// 		if (isDatesLine) {
// 			const sittingDate = line.substring(0, 10);
// 			const otherDate = line.substring(10);

// 			if (sittingDate.length > 0) {
// 				sittingDaysAttendanceRecorded.push(new Date(sittingDate));
// 			}
// 			if (otherDate.length > 0) {
// 				otherDaysAttendanceRecorded.push(new Date(otherDate));
// 			}
// 		}
// 	}
// 	return memberRecords;
// })
// .catch((error) => {
// 	console.log(error);
// 	return;
// });
// }

// /** @format */

// type DateRange = {
// 	start_date: Date;
// 	end_date: Date;
// };

// function parseDateRange([startDateStr, endDateStr]: string[]): DateRange {
// 	const startDate = new Date(convertDMYdate2MDY(startDateStr));
// 	const endDate = new Date(convertDMYdate2MDY(endDateStr));

// 	const dateRange: DateRange = {
// 		dateRange: {
// 			start_date: startDate,
// 			end_date: endDate,
// 		},
// 	};

// 	return dateRange;
// }

// // url in format https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2023/2023-06-01_deputies-verification-of-attendance-for-the-payment-of-taa-01-january-2023-to-30-april-2023_en.pdf
// export default function parseSittingDaysReport(
// 	url: string
// ): SittingDaysReport[] | void {
// 	const memberRecords: SittingDaysReport[] = [];

// 	axios.get(`api/pdf2text?url=${url}`).then((response) => {
// 		const text = response.data.text;
// 		const regex = /Sitting Days Report/; // Regular expression to match name + "Sitting Days Report"
// 		let members = text.split(regex).filter(Boolean);

// 		members = members.map((line: string) => {
// 			const lines = line
// 				.split('\n')

// 			if (lines.length > 7) {
// 				let name, dateRange, limit;

// 				const sittingDates: string[] = [];
// 				const otherDates: string[] = [];
// 				let totalPossibleSittings = 0;
// 				let sittingTotal = 0;
// 				let otherTotal = 0;
// 				let isFound = false;

// 				for (let i = 0; i < lines.length; i++) {
// 					const line = lines[i];
// 					if (!name && line.includes('Deputy')) {
// 						name = lines[i - 1];
// 						console.log(name, lines[i - 1]);
// 					}
// 					if (!dateRange && line.includes('Date Range')) {
// 						dateRange = line.replace('Date Range', '').trim();
// 						let [start_date, end_date] = dateRange?.split(' to ');
// 						dateRange = { start_date, end_date };
// 					} else if (!limit && line.includes('Limit:')) {
// 						limit = parseInt(line.split('Limit: ')[1], 10);
// 					} else if (
// 						line.startsWith('Sub-total') &&
// 						sittingTotal === 0 &&
// 						otherTotal === 0
// 					) {
// 						// Gets total number of sitting days and other days as per documentation
// 						let [temp, sitting, other] = line.split('Sub-total: ');
// 						sittingTotal = parseInt(sitting);
// 						otherTotal = parseInt(other);
// 						isFound = true;
// 						i = 4;
// 					} else if (isFound === true) {
// 						// otherdates greater than other total issue
// 						if (line.length === 10) {
// 							if (sittingTotal > otherTotal) {
// 								sittingDates.push(line);
// 							} else if (otherTotal > sittingTotal) {
// 								otherDates.push(line);
// 							}
// 						} else if (otherDates.length === 0 && sittingDates.length === 0) {
// 							isFound = false;
// 						} else {
// 							const sittingDate = line.slice(0, 10);
// 							const otherDate = line.slice(10);
// 							sittingDates.push(sittingDate);
// 							otherDates.push(otherDate);
// 						}
// 					} else if (lines[i].includes('sitting days in the period')) {
// 						totalPossibleSittings = parseInt(
// 							lines[i].split('period')[1].trim()
// 						);
// 						isFound = false;
// 						break;
// 					}
// 				}

// 				return {
// 					name,
// 					dateRange,
// 					limit,
// 					totalPossibleSittings,
// 					sittingDates,
// 					otherDates,
// 					sittingTotal,
// 					otherTotal,
// 					url,
// 				};
// 			}
// 		});
// 		console.log(members);
// 	});
// }
