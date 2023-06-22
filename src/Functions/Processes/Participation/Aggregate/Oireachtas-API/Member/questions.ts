/** @format */

import fetchQuestions from '@/Functions/API-Calls/OireachtasAPI/questions';
import { Question } from '@/Models/OireachtasAPI/question';

export type MemberQuestionAggregate = {
	uri: string;
	date: string;
	oralQuestionCount: number;
	writtenQuestionCount: number;
};

export default async function aggregateOirQuestions(
	memberId: string,
	start: string,
	end: string
): Promise<MemberQuestionAggregate[] | undefined> {
	// Fetch raw question data
	const questions = await fetchQuestions({
		member_id: memberId,
		date_start: start,
		date_end: end,
	});

	// Aggregate questions by member
	const aggregatedQuestions = parseQuestions(questions, memberId);

	return aggregatedQuestions;
}

function parseQuestions(
	questions: Question[],
	memberUri: string
): MemberQuestionAggregate[] {
	// Create an object to store aggregated questions
	const aggregatedQuestions: { [key: string]: MemberQuestionAggregate } = {};

	// Iterate through each question
	questions.forEach((question) => {
		const questionKey = question.date;

		// If the question key doesn't exist in aggregatedQuestions, create a new entry
		if (!aggregatedQuestions[questionKey]) {
			const aggregatedQuestion: MemberQuestionAggregate = {
				uri: memberUri,
				date: question.date,
				writtenQuestionCount: 0,
				oralQuestionCount: 0,
			};
			aggregatedQuestions[questionKey] = aggregatedQuestion;
		}

		// Increment the count of the corresponding question
		if (question.type === 'written') {
			aggregatedQuestions[questionKey].writtenQuestionCount++;
		} else if (question.type === 'oral') {
			aggregatedQuestions[questionKey].oralQuestionCount++;
		}
	});

	// Return the aggregated questions as an array
	return Object.values(aggregatedQuestions);
}
