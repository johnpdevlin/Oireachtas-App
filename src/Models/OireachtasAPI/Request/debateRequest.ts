/** @format */

import { ChamberId, ChamberType } from '@/Models/_utility';

export interface debateRequest {
	member?: string;
	chamber_type?: ChamberType;
	chamber_id?: ChamberId;
	date_start: string;
	date_end?: string;
	debate_id?: string;
	limit?: number;
}
