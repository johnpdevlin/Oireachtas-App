/** @format */

import { Chamber } from '@/models/_utils';

export type HouseRequest = {
	chamber?: Chamber & 'dail & seanad';
	house_no?: number;
	limit?: number;
};

export type House = {
	dateRange: {
		start: string;
		end: string | null;
	};
	seats: number;
	houseNo: string;
	houseCode: string;
	chamberType: string;
	chamberCode: string;
	houseType: string;
	uri: string;
	showAs: string;
};

export type HouseApiResponse = {
	head: {
		counts: {
			houseCount: number;
			resultCount: number;
		};
		dateRange: {
			start: string;
			end: string | null;
		};
		lang: string;
	};
	results: { house: House }[];
};
