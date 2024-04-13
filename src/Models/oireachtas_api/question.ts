/** @format */

export type QuestionType = 'oral' | 'written';

export type QuestionRequest = {
	member_id?: string;
	qType?: QuestionType;
	date_start?: string | Date;
	date_end?: string | Date;
	limit?: number;
	question_id?: string;
	question_no?: number;
};

export type Question = {
	member_uri: string;
	type: QuestionType;
	addressedTo: string;
	topic: string;
	content: string;
	questionNumber: number;
	date: string;
	url: string;
};
