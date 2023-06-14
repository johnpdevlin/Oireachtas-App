/** @format */

import fetchQuestions from '@/Functions/API-Calls/OireachtasAPI/questions';

export default async function aggregateQuestions(
	member_id: string,
	start: Date,
	end: Date
): Promise<{
	oralQuestions: number;
	writtenQuestions: number;
	datesWQsAsked: Date[];
	datesOQsAsked: Date[];
}> {
	// arrays to hold dates in which Qs asked
	const datesWQsAsked: Date[] = [];
	const datesOQsAsked: Date[] = [];

	// Fetches raw Q data
	const questions = await fetchQuestions({
		member_id: member_id,
		date_start: start,
		date_end: end,
	});

	let writtenQuestions: number = 0; // counter variables
	let oralQuestions: number = 0;
	let lastWDate: Date = new Date('1900-01-01');
	let lastODate: Date = new Date('1900-01-01');

	for (let q of questions) {
		const date: Date = new Date(q.date);

		// sorts questions into written and oral and increments counts
		// parses out individual dates

		if (q.type == 'oral') {
			if (date.getTime() !== lastODate.getTime()) {
				datesOQsAsked.push(date);
				lastODate = date;
			}
			oralQuestions++;
		} else if (q.type == 'written') {
			if (date.getTime() !== lastWDate.getTime()) {
				datesWQsAsked.push(date);
				lastWDate = date;
			}
			writtenQuestions++;
		}
	}

	return { oralQuestions, writtenQuestions, datesWQsAsked, datesOQsAsked };
}
