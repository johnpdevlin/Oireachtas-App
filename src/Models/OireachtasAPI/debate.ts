/** @format */

import { Chamber, ChamberType } from '@/Models/_utility';

export type DebateRequest = {
	member?: string;
	chamber_type?: ChamberType;
	chamber_id?: Chamber;
	date_start?: string | Date;
	date_end?: string | Date;
	debate_id?: string;
	limit?: number;
};
