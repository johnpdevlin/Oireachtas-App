/** @format */

import { Chamber, QuestionType } from '@/Models/_utility';

export default interface OireachtasRequest {
	uri?: string;
	member_id?: string;
	date_start?: string;
	date_end?: string;
	house_no?: number;
	chamber_id?: Chamber;
	const_code?: string;
	party_code?: string;
	debate_id?: string;
	qType?: QuestionType;
	limit?: number;
}
