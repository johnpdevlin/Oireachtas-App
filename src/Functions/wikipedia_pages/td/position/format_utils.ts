/** @format */

import { removeTextBetweenParentheses } from '@/functions/_utils/strings';
import { WikiPosition } from '@/models/member/wiki_profile';
import { isDate } from 'date-fns';

// Formats and registers if dates are incomplete
export function formatDateRange(
	tempStart: string,
	tempEnd: string | undefined
) {
	const start = formatDate(tempStart);
	const end = formatDate(tempEnd);
	const isIncomplete = start.isIncomplete! || end.isIncomplete!;
	return { start: start.date as Date, end: end.date, isIncomplete };
}

// Removes unneccesary characters / strings
export function formatName(name: string) {
	name.includes('(') && !name.includes('title')
		? (name = removeTextBetweenParentheses(name))
		: undefined;
	name.includes('\n') ? (name = name.replace('\n', '')) : undefined;
	return name;
}

// Formats and records / compensates for incomplete dates or just years recorded
function formatDate(dateStr: string | undefined): {
	date: Date | undefined;
	isIncomplete: boolean;
} {
	let isIncomplete = false;
	let date: Date | undefined = undefined;

	if (dateStr) {
		dateStr = dateStr.trim();

		// Check if the string starts with a digit (assumes it's a year)
		if (!isNaN(parseInt(dateStr[0]))) {
			// If the length is 4, assume it's just a year
			if (dateStr.length === 4) {
				dateStr = '1 January ' + dateStr;
				isIncomplete = true;
			}
		} else {
			// If the string doesn't start with a digit, prepend '1'
			dateStr = '1 ' + dateStr;
			isIncomplete = true;
		}

		// Attempt to create a Date object from the formatted string
		const parsedDate = new Date(dateStr);

		// Check if the parsed date is valid
		if (!isNaN(parsedDate.getTime())) date = parsedDate;
	}

	return {
		date: date,
		isIncomplete: isIncomplete,
	};
}
export function logObjIssues(relevantSection: string, obj: WikiPosition) {
	if (obj.type === 'other') console.info('other type recorded:', obj);
	else if (obj.dateRange.end! && obj.dateRange.end < obj.dateRange.start)
		console.info(relevantSection, 'Date range incorrect:', obj.dateRange);
	else if (
		(!obj.dateRange.end && !obj.dateRange.start) ||
		!isDate(obj.dateRange.start)
	)
		console.info(relevantSection, 'No date range recorded:', obj.dateRange);
	else if (
		parseInt(obj.title.name[0]!) &&
		!obj.title.name.includes('Taoiseach')
	)
		console.info(relevantSection, 'Error in title? ', obj);
}
