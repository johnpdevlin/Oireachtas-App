/** @format */

import { ChamberId } from '../../_utility';

export interface ConstituencyRequest {
	chamber_id: ChamberId;
	house_no: number;
	limit?: number;
}
