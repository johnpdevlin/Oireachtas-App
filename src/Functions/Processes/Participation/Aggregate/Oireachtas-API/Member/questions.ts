/** @format */

import fetchQuestions from '@/Functions/API-Calls/OireachtasAPI/questions';
import { Question } from '@/Models/OireachtasAPI/question';

export type MemberQuestionAggregate = {
	uri: string;
	date: Date;
	type: string;
	count: number;
};

export default async function aggregateOirQuestions(
	memberId: string,
	start: string,
	end: string
): Promise<
	| {
			oral: MemberQuestionAggregate[];
			written: MemberQuestionAggregate[];
	  }
	| undefined
> {
	// Fetch raw question data
	const questions = await fetchQuestions({
		member_id: memberId,
		date_start: start,
		date_end: end,
	});

	// Separate oral and written questions
	const oralQuestions = questions.filter((q) => q.type === 'oral');
	const writtenQuestions = questions.filter((q) => q.type === 'written');

	// Aggregate questions by member
	const aggregatedOralQuestions = parseQuestions(oralQuestions, memberId);
	const aggregatedWrittenQuestions = parseQuestions(writtenQuestions, memberId);

	return {
		oral: aggregatedOralQuestions,
		written: aggregatedWrittenQuestions,
	};
}

function parseQuestions(
	questions: Question[],
	memberUri: string
): MemberQuestionAggregate[] {
	// Create an object to store aggregated questions
	const aggregatedQuestions: { [key: string]: MemberQuestionAggregate } = {};

	// Iterate through each question
	questions.forEach((question) => {
		const questionKey = question.date.toISOString();

		// If the question key doesn't exist in aggregatedQuestions, create a new entry
		if (!aggregatedQuestions[questionKey]) {
			const aggregatedQuestion: MemberQuestionAggregate = {
				uri: memberUri,
				date: question.date,
				type: question.type,
				count: 0,
			};
			aggregatedQuestions[questionKey] = aggregatedQuestion;
		}

		// Increment the count of the corresponding question
		aggregatedQuestions[questionKey].count++;
	});

	// Return the aggregated questions as an array
	return Object.values(aggregatedQuestions);
}
