/** @format */

import { Question } from '../../../Models/UI/participation';

export default function formatQuestions(questions: any[]): Promise<Question[]> {
	const formattedQuestions = async (): Promise<Question[]> => {
		// Formats by removing unnecessary properties and passing into correct type interfaces

		const qs = () => {
			const qs = [];
			for (let q of questions) {
				const question = {
					type: q.question.questionType,
					addressedTo: q.question.to.showAs,
					topic: q.question.debateSection.showAs,
					content: q.question.showAs,
					questionNumber: q.question.questionNumber,
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
