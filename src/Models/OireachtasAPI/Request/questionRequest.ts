/** @format */

export interface QuestionRequest {
	member_id?: string;
	qType?: 'oral' | 'written';
	date_start?: string;
	date_end?: string;
	limit?: number;
	question_id?: string;
	question_no?: number;
}
