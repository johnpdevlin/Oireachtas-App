/** @format */

import { MonthChar, OirDate } from '@/models/dates';

/** @format */
export function convertDMYdate2YMD(dateStr: string): OirDate {
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

export function convertYMDdate2DMY(dateStr: OirDate): string {
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

export function convertDMYdate2YMDstring(dateStr: string): OirDate {
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

export function extractDateFromYMDstring(input: OirDate): Date | undefined {
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
	const month = getMonthNumber(dateParts[1]);
	const year = parseInt(dateParts[2]);

	if (isNaN(day) || isNaN(month) || isNaN(year)) {
		// Invalid date parts
		return undefined;
	}

	// Note: Months in JavaScript's Date object are zero-based (0 - 11)
	const date = new Date(year, month - 1, day);

	if (isNaN(date.getTime())) {
		// Invalid date
		return undefined;
	}

	return date;
}

function getMonthNumber(month: string): number {
	const monthNames: { [key: string]: number } = {
		January: 0,
		February: 1,
		March: 2,
		April: 3,
		May: 4,
		June: 5,
		July: 6,
		August: 7,
		September: 8,
		October: 9,
		November: 10,
		December: 11,
	};

	return monthNames[month];
}

export function dateToYMDstring(date: Date): OirDate {
	const year = date.getFullYear().toString().padStart(4, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}` as OirDate;
}

export function YMDstringToDate(dateString: OirDate): Date {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
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

export function getMonthStrFromNumber(months: number[]): MonthChar[] | void {
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

	const output = months.map((month) => {
		if (month >= 1 && month <= 12) {
			return monthNames[month - 1];
		} else {
			return 'Unknown';
		}
	});

	if (output.length > 0 && !output.includes('Unknown'))
		return output as MonthChar[];
	else console.warn('Error with months: ', output);
}

export function getEndDateObj(end: OirDate | undefined | null) {
	if (end!) return new Date(end);
	else return null;
}
export function getEndDateStr(end: OirDate | undefined | null) {
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

	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	return date.toLocaleDateString(undefined, options);
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
