/** @format */

import { DateRangeObj } from '../dates';

export type WikiURIpair = {
	name: string;
	wikiURI: string | undefined;
};

export type WikiPositionType =
	| 'td'
	| 'senator'
	| 'ceann comhairle'
	| 'leas-cheann comhairle'
	| 'committee chair'
	| 'senior minister'
	| 'junior minister'
	| 'government chief whip'
	| 'party leader'
	| 'party deputy leader'
	| 'party chair'
	| 'party dáil leader'
	| 'leader of the opposition'
	| 'seanad leader'
	| 'seanad deputy leader'
	| 'councillor'
	| 'mayor'
	| 'mep'
	| 'mla'
	| 'mp'
	| 'european commissioner'
	| 'eurogroup president'
	| 'other';

export type WikiPosition = {
	title: WikiURIpair;
	type: WikiPositionType;
	dateRange: DateRangeObj & { isIncomplete: boolean };
	predecessor?: WikiURIpair;
	successor?: WikiURIpair;
};

export type WikiMemberProfileDetails = {
	wikiName: string;
	wikiURI: string;
	birthDate?: Date;
	birthPlace?: string;
	birthCountry?: string;
	positions: WikiPosition[];
	education?: WikiURIpair[];
	almaMater?: WikiURIpair[];
	// marriageDetails?: string[];
	// domesticPartner?: string;
	numOfChildren?: number;
	relatives?: WikiURIpair[];
	websiteUrl?: string;
};
