/** @format */

import { DateRange, MonthChar, OirDate } from '@/models/dates';

/** @format */
export function convertDMYdate2YMD(dateStr: string): string {
	const parts = dateStr.split(/[/|-]/);
	let day, month, year;

	if (parts.length === 3) {
		// the date string has day, month, and year components
		day = parts[0].padStart(2, '0');
		month = parts[1].padStart(2, '0');
		year = parts[2];
	} else if (parts.length === 1) {
		// the date string has no separators; assume that the first two digits are the day,
		// the next two digits are the month, and the last four digits are the year
		month = parts[0].slice(0, 2).padStart(2, '0');
		year = parts[0].slice(2, 4).padStart(2, '0');
		day = parts[0].slice(4);
	} else {
		// the date string is invalid
		throw new Error('Invalid date string: ' + dateStr);
	}

	// format the date as "yyyy/mm/dd"
	return `${year}-${month}-${day}` as OirDate;
}

export function convertDMYdate2MDY(dateStr: string): string {
	// split the date string into its day, month, and year components
	const parts = dateStr.split(/[/|-]/);
	let day, month, year;

	if (parts.length === 3) {
		// the date string has day, month, and year components
		day = parts[0].padStart(2, '0');
		month = parts[1].padStart(2, '0');
		year = parts[2];
	} else if (parts.length === 1) {
		// the date string has no separators; assume that the first two digits are the day,
		// the next two digits are the month, and the last four digits are the year
		day = parts[0].slice(0, 2).padStart(2, '0');
		month = parts[0].slice(2, 4).padStart(2, '0');
		year = parts[0].slice(4);
	} else {
		// the date string is invalid
		throw new Error('Invalid date string: ' + dateStr);
	}

	// format the date as "mm/dd/yyyy"
	return `${month}-${day}-${year}`;
}

export function convertMDYdate2DMY(dateStr: string): string {
	// split the date string into its day, month, and year components
	const parts = dateStr.split(/[/|-]/);
	let day, month, year;

	if (parts.length === 3) {
		// the date string has day, month, and year components
		month = parts[0].padStart(2, '0');
		day = parts[1].padStart(2, '0');
		year = parts[2];
	} else if (parts.length === 1) {
		// the date string has no separators; assume that the first two digits are the day,
		// the next two digits are the month, and the last four digits are the year
		month = parts[0].slice(0, 2).padStart(2, '0');
		day = parts[0].slice(2, 4).padStart(2, '0');
		year = parts[0].slice(4);
	} else {
		// the date string is invalid
		throw new Error('Invalid date string: ' + dateStr);
	}

	// format the date as "dd/mm/yyyy"
	return `${day}-${month}-${year}`;
}

export function convertYMDdate2DMY(dateStr: string): string {
	// Split the date string into its day, month, and year components
	const parts = dateStr.split(/[/|-]/);
	let day: string, month: string, year: string;

	if (parts.length === 3) {
		// The date string has day, month, and year components
		day = parts[2].padStart(2, '0');
		month = parts[1].padStart(2, '0');
		year = parts[0];
	} else if (parts.length === 1) {
		// The date string has no separators; assume that the first two digits are the day,
		// the next two digits are the month, and the last four digits are the year
		day = parts[0].slice(6);
		month = parts[0].slice(4, 6).padStart(2, '0');
		year = parts[0].slice(0, 4);
	} else {
		// The date string is invalid
		throw new Error('Invalid date string: ' + dateStr);
	}

	// Format the date as "dd/mm/yyyy"
	return `${day}-${month}-${year}`;
}

export function convertDMYdate2YMDstring(dateStr: string): string {
	// Split the date string into its day, month, and year components
	const parts = dateStr.split(/[/|-]/);
	let day: string, month: string, year: string;
	if (parts.length === 3) {
		// The date string has day, month, and year components
		day = parts[0].padStart(2, '0');
		month = parts[1].padStart(2, '0');
		year = parts[2];
	} else if (parts.length === 1) {
		// The date string has no separators; assume that the first two digits are the day,
		// the next two digits are the month, and the last four digits are the year
		day = parts[0].slice(0, 2).padStart(2, '0');
		month = parts[0].slice(2, 4).padStart(2, '0');
		year = parts[0].slice(4);
	} else {
		// The date string is invalid
		throw new Error('Invalid date string: ' + dateStr);
	}
	return `${year}-${month}-${day}` as OirDate;
}

export function extractDateFromYMDstring(input: string): Date | undefined {
	// Extracts a date string in "YYYY-MM-DD" format from the input string and
	// Returns it as a Date object.

	const regex = /\d{4}-\d{2}-\d{2}/; // Regex pattern for "YYYY-MM-DD" format
	const match = input.match(regex); // Find the date string in the input

	if (match) {
		const date = new Date(match[0]); // Convert the matched string to a Date object
		return date;
	}

	// Return undefined if no date string was found
	return undefined;
}

export function extractDateFromDMYstring(input: string): Date | undefined {
	// Extracts a date string in "DD/MM/YYYY" format from the input string and
	// Returns it as a Date object.

	const regex = /\d{2}\/\d{2}\/\d{4}/; // Regex pattern for "DD/MM/YYYY" format
	const match = input.match(regex); // Find the date string in the input

	if (match) {
		const date = new Date(match[0]); // Convert the matched string to a Date object
		return date;
	}

	// Return undefined if no date string was found
	return undefined;
}
export function extractDateFromDmonthYstring(
	dateString: string
): Date | undefined {
	const dateParts = dateString.split(/\s+/);

	if (dateParts.length !== 3) {
		// Invalid date string format
		return undefined;
	}

	const day = parseInt(dateParts[0]);
	const month = strMonthToNumber(dateParts[1]);
	const year = parseInt(dateParts[2]);

	if (isNaN(day) || isNaN(month!) || isNaN(year)) {
		// Invalid date parts
		return undefined;
	}

	// Note: Months in JavaScript's Date object are zero-based (0 - 11)
	const date = new Date(year, month! - 1, day);

	if (isNaN(date.getTime())) {
		// Invalid date
		return undefined;
	}

	return date;
}

export function strMonthToNumber(month: string): number | undefined {
	month = month.toLowerCase();

	if (month.length === 3) return monthAbbreviationToNumber(month);

	const monthNames: { [key: string]: number } = {
		january: 0,
		february: 1,
		march: 2,
		april: 3,
		may: 4,
		june: 5,
		july: 6,
		august: 7,
		september: 8,
		october: 9,
		november: 10,
		december: 11,
	};

	return monthNames[month];
}

function monthAbbreviationToNumber(
	monthAbbreviation: string
): number | undefined {
	const months: { [key: string]: number } = {
		jan: 0,
		feb: 1,
		mar: 2,
		apr: 3,
		may: 4,
		jun: 5,
		jul: 6,
		aug: 7,
		sep: 8,
		oct: 9,
		nov: 10,
		dec: 11,
	};

	return months[monthAbbreviation];
}

export function dateToYMDstring(date: Date): string {
	const year = date.getFullYear().toString().padStart(4, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}` as string;
}

export function YMDstringToDate(dateString: string): Date {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
}

export function getTodayDateString(): string {
	return dateToYMDstring(new Date());
}

export function getUniqueDatesFromObjects(data: { date: string }[]): string[] {
	const uniqueDatesSet = new Set<string>();

	for (const item of data) {
		uniqueDatesSet.add(item.date);
	}

	return Array.from(uniqueDatesSet);
}

export function checkWithinDateRange(
	date: Date,
	dateRange: { start: Date; end: Date }
): boolean {
	return (
		date.getTime() >= dateRange.start.getTime() &&
		date.getTime() <= dateRange.end.getTime()
	);
}

export function getDateTwoWeeksAgo(): number {
	return Date.now() - 1209600000;
}

export function getMonthStrFromNumber(month: number): MonthChar | undefined {
	const monthNames: MonthChar[] = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	return monthNames.at(month);
}

export function getEndDateObj(end: string) {
	if (end!) return new Date(end);
	else return null;
}
export function getEndDateStr(end: string) {
	if (end!) return end;
	else return null;
}

export function getCurrentYear(): number {
	const year = new Date().getFullYear();
	return year;
}

export function formatDateToString(date: Date | string): string {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	// Use the 'en-IE' locale for English - Ireland
	const formattedDate = date.toLocaleDateString('en-IE', options);

	return formattedDate;
}

export function calculateYearsAndMonthsSinceDate(input: Date | string): {
	years: number;
	months: number;
} {
	// Convert input to a Date object if it's a string
	const currentDate = typeof input === 'string' ? new Date(input) : input;

	// Get the current date
	const now = new Date();

	// Calculate the difference in years and months
	let yearsDiff = now.getFullYear() - currentDate.getFullYear();
	let monthsDiff = now.getMonth() - currentDate.getMonth();

	// Adjust for cases where monthsDiff may be negative
	if (monthsDiff < 0) {
		yearsDiff--;
		monthsDiff += 12;
	}

	return { years: yearsDiff, months: monthsDiff };
}

export function convertDaysToYearsAndMonths(days: number) {
	// Define the average number of days in a month
	const avgDaysInMonth = 30.4166666667;

	// Calculate years and remaining days
	const years = Math.floor(days / 365);
	const remainingDays = days % 365;

	// Calculate months from remaining days
	const months = Math.floor(remainingDays / avgDaysInMonth);

	return { years, months };
}

export function calculateRawDaysBetweenDates(dateRange: DateRange) {
	// Destructure start and end dates from dateRange
	const { start, end } = dateRange;

	// Convert start and end dates to milliseconds
	const startDate = new Date(start).getTime();
	const endDate = end ? new Date(end).getTime() : Date.now(); // Use current date if end is undefined

	// Calculate duration in milliseconds
	const durationInMs = endDate - startDate;

	// Convert milliseconds to days
	const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));

	return days;
}

export function aggregateDatesToMonthsArray(
	dates: (string | undefined | Date)[]
): Date[][] {
	const aggregated: Date[][] = Array.from({ length: 12 }, () => []);

	dates.forEach((d) => {
		if (d != null) {
			// Check if d is not null or undefined
			let date: Date;
			if (typeof d === 'string') {
				const parsedDate = new Date(d);
				if (!isNaN(parsedDate.getTime())) {
					// Check if the parsed date is valid
					date = parsedDate;
				} else {
					return; // Skip to the next iteration if the date string is invalid
				}
			} else {
				date = d;
			}
			const month = date.getMonth();
			aggregated[month].push(date);
		}
	});

	return aggregated;
}
