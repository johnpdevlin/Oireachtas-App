/** @format */

export interface PartyHead {
	counts: {
		partyCount: number;
		resultCount: number;
	};
	dateRange: {
		start: string;
		end: string | null;
	};
	lang: string;
}
export interface Party {
	partyCode: string;
	uri: string;
	showAs: string;
}

export interface House {
	uri: string;
	houseNo: string;
	houseCode: string;
	showAs: string;
}

export interface PartiesDetailed {
	house: House;
	parties: Party[];
}

export interface PartyResult {
	house: {
		house: House;
		parties: { party: Party }[];
	};
}

export interface PartyApiResponse {
	head: PartyHead;
	results: PartyResult;
}
