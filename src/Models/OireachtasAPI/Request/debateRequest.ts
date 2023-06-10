/** @format */

import { Chamber, ChamberType } from '@/Models/_utility';

export interface debateRequest {
	member?: string;
	chamber_type?: ChamberType;
	chamber_id?: Chamber | string;
	date_start: string;
	date_end?: string;
	debate_id?: string;
	limit?: number;
}
