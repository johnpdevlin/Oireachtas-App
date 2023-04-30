/** @format */

import { ChamberId } from '@/Models/_utility';

export default interface MemberRequest {
	uri?: string;
	date_start?: string;
	date_end?: string;
	house_no?: number;
	chamber_id?: ChamberId;
	const_code?: string;
	party_code?: string;
	limit?: number;
}
