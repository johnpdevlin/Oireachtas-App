/** @format */

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
	return `${month}/${day}/${year}`;
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
	return `${day}/${month}/${year}`;
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
	return `${day}/${month}/${year}`;
}
