/** @format */

import { format } from 'date-fns';
import fetcher from '..';
import { questionRequest } from '../../Models/apiRequests';
import { Question } from '../../Models/UI/participation';
import formatQuestions from './Formatter/questions';

export default async function fetchQuestions(
	props: questionRequest
): Promise<Question[] | any[]> {
	if (props.date instanceof Date) {
		props.date = format(props.date, 'yyyy-MM-dd');
	}
	if (props.dateEnd instanceof Date) {
		props.dateEnd = format(props.dateEnd, 'yyyy-MM-dd');
	}

	const url = `https://api.oireachtas.ie/v1/questions?date_start=${
		props.date ? props.date : '1900-01-01'
	}&date_end=${
		props.dateEnd ? props.dateEnd : props.date ? props.date : '2099-01-01'
	}&limit=${props.limit ? props.limit : (props.limit = 3000)}${
		props.questionType ? `&qType=${props.questionType}` : ''
	}${
		props.member
			? `&member_id=https%3A%2F%2Fdata.oireachtas.ie%2Fie%2Foireachtas%2Fmember%2Fid%2F${props.member}`
			: ''
	}`;

	const questions = await fetcher(url); // requests json response

	if (props.formatted == false) {
		return questions.results;
	}

	const formattedQuestions = await formatQuestions(questions.results);

	return formattedQuestions;
}
