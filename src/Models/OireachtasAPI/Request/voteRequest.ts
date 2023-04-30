/** @format */

import { ChamberId, ChamberType, Outcome } from '@/Models/_utility';

export default interface VoteRequest {
	member_id?: string;
	chamber_type?: ChamberType;
	chamber_id?: ChamberId;
	date_start?: string;
	date_end?: string;
	limit?: number;
	outcome?: Outcome;
	debate_id?: string;
	vote_id?: string;
}
