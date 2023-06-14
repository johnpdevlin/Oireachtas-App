/** @format */

import { Question } from '@/Models/OireachtasAPI/question';

export default function formatQuestions(questions: any[]): Promise<Question[]> {
	const formattedQuestions = async () => {
		// Formats by removing unnecessary properties and passing into correct type interfaces

		const qs = () => {
			const qs: Question[] = [];
			for (let q of questions) {
				const question = {
					member_uri: q.question.from.memberCode,
					type: q.question.questionType,
					addressedTo: q.question.to.showAs,
					topic: q.question.debateSection.showAs,
					content: q.question.showAs,
					questionNumber: parseInt(q.question.questionNumber),
					date: new Date(q.contextDate),
					url: `https://www.oireachtas.ire/en/debates/question/${q.contextDate}/${q.question.questionNumber}`,
				};
				qs.push(question);
			}
			return qs;
		};
		return qs();
	};

	return formattedQuestions();
}
