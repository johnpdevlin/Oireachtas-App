/** @format */

import { Chamber } from '@/models/_utils';

export type PartyRequest = {
	chamber?: Chamber;
	house_no?: number;
	house_details?: boolean;
	showAs?: string;
	limit?: number;
};

export type PartyAPI = {
	uri: string;
	name: string;
};

export type PartyResult = {
	party: {
		showAs: string;
		partyCode: string;
		uri: string;
	};
};

export type House = {
	uri: string;
	houseNo: string;
	houseCode: string;
	showAs: string;
};

export type HouseParties = {
	parties: PartyResult[];
	house: House;
};

export type HeadCounts = {
	partyCount: number;
	resultCount: number;
};

export type DateRange = {
	start: string;
	end: string;
};

export type Head = {
	counts: HeadCounts;
	dateRange: DateRange;
	lang: string;
};

export type ApiResponse = {
	head: Head;
	results: {
		house: HouseParties;
	};
};
