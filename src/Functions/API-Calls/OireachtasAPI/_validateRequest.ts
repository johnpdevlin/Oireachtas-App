/** @format */

import { dateToYMDstring } from '@/Functions/Util/dates';
import isValidDate from '@/Functions/Validate/validateOireachtasDate';

import { Chamber, QuestionType } from '@/Models/_utility';
import { th } from 'date-fns/locale';

export type OireachtasRequest = {
	uri?: string;
	member_id?: string;
	date_start?: string | Date;
	date_end?: string | Date;
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
		if (props.date_start! || props.date_end!) {
			if (isValidDate([props.date_start!, props.date_end!]) === false) {
				throw new Error(
					`${props.date_start!} & ${props.date_end!} : Invalid date(s), should be in format YYYY-MM-DD`
				);
			}
		}
	} catch (e) {
		console.error(e);
	}

	return props;
}
