/** @format */

import fetcher from '..';
import { Question, QuestionRequest } from '@/Models/OireachtasAPI/question';
import validateOireachtasRequest from './_validateRequest';

export async function formatQuestions(questions: any[]): Promise<Question[]> {
	// Formats by removing unnecessary properties and passing into correct type
	const qs: Question[] = [];
	for (let q of questions) {
		const question = {
			member_uri: q.question.by.memberCode,
			type: q.question.questionType,
			addressedTo: q.question.to.showAs,
			topic: q.question.debateSection.showAs,
			content: q.question.showAs,
			questionNumber: parseInt(q.question.questionNumber),
			date: q.contextDate,
			url: `https://www.oireachtas.ire/en/debates/question/${q.contextDate}/${q.question.questionNumber}`,
		};
		qs.push(question);
	}
	return qs;
}

export default async function fetchQuestions(
	props: QuestionRequest
): Promise<Question[]> {
	props = validateOireachtasRequest(props);

	const url = `https://api.oireachtas.ie/v1/questions?date_start=${
		props.date_start ? props.date_start : '1900-01-01'
	}&date_end=${
		props.date_end
			? props.date_end
			: props.date_start
			? props.date_start
			: '2099-01-01'
	}&limit=${props.limit ? props.limit : (props.limit = 3000)}${
		props.member_id
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member_id}`
			: ''
	}`;

	const questions = formatQuestions((await fetcher(url)).results); // requests json response

	return questions;
}
