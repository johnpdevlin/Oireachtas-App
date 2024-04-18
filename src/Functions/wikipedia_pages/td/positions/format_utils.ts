/** @format */

import { formatIncompleteDate } from '@/functions/_utils/dates';
import { removeTextBetweenParentheses } from '@/functions/_utils/strings';
import { WikiPosition } from '@/models/member/wiki_profile';
import { isDate } from 'date-fns';

// Formats and registers if dates are incomplete
export function formatDateRange(
	tempStart: string,
	tempEnd: string | undefined
) {
	const start = formatIncompleteDate(tempStart);
	const end = formatIncompleteDate(tempEnd);
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
