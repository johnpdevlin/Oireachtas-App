/** @format */

import { Chamber } from '@/Models/_utility';

export type PartyRequest = {
	chamber_id?: Chamber;
	house_no?: number;
	house_details?: boolean;
	showAs?: string;
	limit?: number;
};
