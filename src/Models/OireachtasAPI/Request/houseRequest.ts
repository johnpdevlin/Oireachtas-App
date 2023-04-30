/** @format */

import { ChamberId } from '@/Models/_utility';

export default interface HouseRequest {
	chamber?: ChamberId & 'dail & seanad';
	house_no?: number;
	limit?: number;
	formatted?: boolean;
	serialized?: boolean;
}
