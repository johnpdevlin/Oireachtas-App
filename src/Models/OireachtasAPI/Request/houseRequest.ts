/** @format */

import { Chamber } from '@/Models/_utility';

export default interface HouseRequest {
	chamber?: Chamber & 'dail & seanad';
	house_no?: number;
	limit?: number;
}
