/** @format */

import { ChamberId } from '@/Models/_utility';

export default interface PartyRequest {
	chamber_id?: ChamberId;
	house_no?: number;
	house_details?: boolean;
	showAs?: string;
	limit?: number;
}
