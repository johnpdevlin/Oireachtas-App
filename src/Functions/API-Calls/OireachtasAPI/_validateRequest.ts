/** @format */

import isValidDate from '@/Functions/Validate/validateOireachtasDate';
import OireachtasRequest from '@/Models/OireachtasAPI/_request';

export default function validateOireachtasRequest(
	props: OireachtasRequest
): boolean {
	let isValid: boolean = true;

	if (props.date_start! || props.date_end!) {
		if (isValidDate([props.date_start!, props.date_end!]) === false) {
			console.log(
				`${props.date_start!} ${props.date_end!} 
				Invalid date(s), should be in format YYYY-MM-DD`
			);
			isValid = false;
		}
	}

	return isValid;
}
