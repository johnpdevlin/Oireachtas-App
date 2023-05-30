/** @format */

import axios from 'axios';
import { convertDMYdate2MDY } from '../../Util/dateConverter';

type DateRange = {
	dateRange: {
		start_date: Date;
		end_date: Date;
	};
};

type SittingDaysReport = {
	dateRange: DateRange;
	memberFirstName: string;
	memberLastName: string;
	memberName: string;
	limit: number;
	totalPossibleSittings: number;
	sittingDaysAttendanceRecorded: (Date | undefined)[];
	otherDaysAttendanceRecorded: (Date | undefined)[];
	url: string;
};

function parseDateRange([startDateStr, endDateStr]: string[]): DateRange {
	const startDate = new Date(convertDMYdate2MDY(startDateStr));
	const endDate = new Date(convertDMYdate2MDY(endDateStr));

	const dateRange: DateRange = {
		dateRange: {
			start_date: startDate,
			end_date: endDate,
		},
	};

	return dateRange;
}

export default function parseSittingDaysReport(
	url: string
): SittingDaysReport[] | void {
	const memberRecords: SittingDaysReport[] = [];

	axios
		.get(`api/pdf2text?url=${url}`)
		.then((response) => {
			const text = response.data.text;
			const lines = text
				.split('\n')
				.filter((line: string) => line.trim() !== '');

			// Gets the date range from the second line
			let dateRange = lines[1].replace('Date Range ', '');
			dateRange = parseDateRange(dateRange);

			// Gets the name from the third line
			let name: string = lines[2].replace('\nDeputy', '');
			let firstName, lastName;
			[lastName, firstName] = name.split(' ');
			name = `${firstName} ${lastName}`;

			// Gets the limit from the fourth line
			const limit: number = parseInt(lines[3].split('Limit: ')[1], 10);

			let sittingDaysAttendanceRecorded: (Date | undefined)[] = [];
			let otherDaysAttendanceRecorded: (Date | undefined)[] = [];

			let isDatesLine = true;
			let sittingTotal = 0;
			let otherTotal = 0;
			let totalPossibleSittings: number = 0;

			for (let i = 5; i < lines.length; i++) {
				const line = lines[i].trim();
				if (line.startsWith('Total number of sitting days in the period')) {
					// Gets total number of sitting days and other days as per documentation
					isDatesLine = false;
					const sittings = line.split(
						'Total number of sitting days in the period: '
					);
					totalPossibleSittings = parseInt(sittings, 10);
				}
				if (line.startsWith('Sub-total')) {
					// Gets total number of sitting days and other days as per documentation
					isDatesLine = false;
					let [temp, sitting, other] = line.split('Sub-total: ');
					sittingTotal = parseInt(sitting, 10);
					otherTotal = parseInt(other, 10);
				}

				// Add member to array of member records
				// Find new member name and reset variables
				else if (line.startsWith('Date Range 01/01/2022 to 31/12/2022')) {
					memberRecords.push({
						dateRange,
						memberFirstName: firstName,
						memberLastName: lastName,
						memberName: name,
						limit,
						totalPossibleSittings,
						sittingDaysAttendanceRecorded,
						otherDaysAttendanceRecorded,
						url,
					});

					// reset variables for next member
					[lastName, firstName] = lines[i + 1].split(' ');
					name = `${firstName} ${lastName}`;
					sittingDaysAttendanceRecorded = [];
					otherDaysAttendanceRecorded = [];
					isDatesLine = true;
					sittingTotal = 0;
					otherTotal = 0;
				}

				if (isDatesLine) {
					const sittingDate = line.substring(0, 10);
					const otherDate = line.substring(10);

					if (sittingDate.length > 0) {
						sittingDaysAttendanceRecorded.push(new Date(sittingDate));
					}
					if (otherDate.length > 0) {
						otherDaysAttendanceRecorded.push(new Date(otherDate));
					}
				}
			}
			return memberRecords;
		})
		.catch((error) => {
			console.log(error);
			return;
		});
}
