/** @format */

import { format } from 'date-fns';
import fetcher from '..';

import formatQuestions from './Formatter/questions';
import { QuestionRequest } from '@/Models/OireachtasAPI/question';

export default async function fetchQuestions(
	props: QuestionRequest
): Promise<{}[]> {
	const url = `https://api.oireachtas.ie/v1/questions?date_start=${
		props.date_start ? props.date_start : '1900-01-01'
	}&date_end=${
		props.date_end
			? props.date_end
			: props.date_start
			? props.date_start
			: '2099-01-01'
	}&limit=${props.limit ? props.limit : (props.limit = 3000)}${
		props.qType ? `&qType=${props.qType}` : ''
	}${
		props.member_id
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member_id}`
			: ''
	}`;

	const questions = await fetcher(url); // requests json response

	const formattedQuestions = await formatQuestions(questions.results);

	return formattedQuestions;
}
