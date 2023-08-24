/** @format */

import { Chamber, RepresentType } from '../_utils';

export type ConstituencyAPI = {
	type: RepresentType;
	uri: string;
	name: string;
};

export type ConstituencyRequest = {
	chamber: Chamber;
	house_no: number;
	limit?: number;
};

export type ConstituencyOrPanel = {
	representType: RepresentType;
	representCode: string;
	uri: string;
	showAs: string;
};

export type ConstituencyOrPanelApiResponse = {
	head: {
		counts: {
			constituencyCount: number;
			resultCount: number;
		};
		dateRange: {
			start: string;
			end: string | null;
		};
		lang: string;
	};
	results: {
		house: {
			house: {
				houseNo: string;
				showAs: string;
				uri: string;
				houseCode: string;
			};
			constituenciesOrPanels: ConstituencyOrPanel[];
		};
	};
};
