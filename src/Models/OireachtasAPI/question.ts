/** @format */

export type QuestionRequest = {
	member_id?: string;
	qType?: 'oral' | 'written';
	date_start?: string | Date;
	date_end?: string | Date;
	limit?: number;
	question_id?: string;
	question_no?: number;
};

export type Question = {
	member_uri: string;
	type: string;
	addressedTo: string;
	topic: string;
	content: string;
	questionNumber: number;
	date: Date;
	url: string;
};
