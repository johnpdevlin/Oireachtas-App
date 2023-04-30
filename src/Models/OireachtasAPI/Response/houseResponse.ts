/** @format */

export interface HouseHead {
	counts: {
		houseCount: number;
		resultCount: number;
	};
	dateRange: {
		start: string;
		end: string | null;
	};
	lang: string;
}

export interface House {
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
}

export interface HouseResult {
	house: House;
}

export interface HouseApiResponse {
	head: HouseHead;
	results: HouseResult[];
}
