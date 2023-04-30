/** @format */

import { RepresentType } from '@/Models/_utility';

export interface ConstituencyOrPanelHead {
	counts: {
		constituencyCount: number;
		resultCount: number;
	};
	dateRange: {
		start: string;
		end: string | null;
	};
	lang: string;
}

export interface House {
	houseNo: string;
	showAs: string;
	uri: string;
	houseCode: string;
}

export interface ConstituencyOrPanel {
	representType: RepresentType;
	representCode: string;
	uri: string;
	showAs: string;
}

export interface ConstituencyOrPanelResult {
	house: { house: House; constituenciesOrPanels: ConstituencyOrPanel[] };
}

export interface ConstituencyOrPanelApiResponse {
	head: ConstituencyOrPanelHead;
	results: ConstituencyOrPanelResult;
}
