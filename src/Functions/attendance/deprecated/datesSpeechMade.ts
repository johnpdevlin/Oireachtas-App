/** @format */

import fetchDebates from '../../APIs/Oireachtas/debate/_index';
import { getTodayDateString } from '@/functions/_utils/dates';
import { DateRangeStr } from '@/models/dates';

export async function getHouseDatesSpoken(
	member: string,
	dateRange: DateRangeStr
): Promise<string[]> {
	if (dateRange.end === undefined) dateRange.end = getTodayDateString();

	// Fetches debates
	const debates = await fetchDebates({
		member: member,
		date_start: dateRange.start,
		date_end: dateRange.end!,
	});

	const datesSpoke: string[] = [];
	let lastDate: string = '';
	debates!.forEach((debate) => {
		if (lastDate !== debate.date) {
			datesSpoke.push(debate.date as string);
			lastDate = debate.date as string;
		}
	});

	return datesSpoke;
}

export async function parseCommitteeDatesSpoken(
	member: string,
	dateRange: DateRangeStr
) {
	if (dateRange.end === undefined) dateRange.end = getTodayDateString();

	// Fetches debates
	const debates = await fetchDebates({
		member: member,
		chamber_type: 'committee',
		date_start: dateRange.start,
		date_end: dateRange.end!,
	});

	let lastDate: string = '';
	let lastCommittee: string = '';

	debates?.forEach((debate) => {
		const date = debate.date;
		const uri = debate.uri;
		const rootURI = debate.uri;
	});
}
