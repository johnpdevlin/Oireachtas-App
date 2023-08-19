/** @format */

import { dateToYMDstring } from '@/Functions/Util/dates';
import { Chamber, QuestionType, MemberURI } from '@/Models/_utility';
import { OirDate } from '@/Models/dates';
import { th } from 'date-fns/locale';

export type OireachtasRequest = {
	uri?: string;
	member_id?: MemberURI;
	date_start?: OirDate | Date;
	date_end?: OirDate | Date;
	house_no?: number;
	chamber_id?: Chamber;
	const_code?: string;
	party_code?: string;
	debate_id?: string;
	qType?: QuestionType;
	limit?: number;
};

export default function validateOireachtasRequest(
	props: OireachtasRequest
): OireachtasRequest {
	try {
		if (props.date_start instanceof Date) {
			props.date_start = dateToYMDstring(props.date_start);
		}
		if (props.date_end instanceof Date) {
			props.date_end = dateToYMDstring(props.date_end);
		}
		if (props.date_end == undefined) {
			props.date_end = dateToYMDstring(new Date());
		}
	} catch (e) {
		console.error(e);
	}

	return props;
}
