/** @format */

import { DateRangeObj } from '../dates';

export type WikiURIpair = {
	name: string;
	wikiURI: string | undefined;
};

type WikiConstitPosition = 'td' | 'senator' | 'mp' | 'mep' | 'mla';
type WikiMinistryPosition =
	| 'senior minister'
	| 'junior minister'
	| 'government chief whip';
type WikiDailPosition =
	| 'ceann comhairle'
	| 'leas-cheann comhairle'
	| 'leader of the opposition'
	| 'opposition chief whip';
type WikiOireachtasPosition = 'committee chair';
type WikiSeanadPosition = 'seanad leader' | 'seanad deputy leader';
type WikiPartyPosition =
	| 'party leader'
	| 'party deputy leader'
	| 'party chair'
	| 'party deputy chair'
	| 'party dáil leader'
	| 'party seanad leader'
	| 'parliamentary party chair';
type WikiEuroPosition = 'european commissioner' | 'eurogroup president';
type WikiLocalPosition = 'councillor' | 'mayor';

export type WikiPositionType =
	| WikiConstitPosition
	| WikiMinistryPosition
	| WikiDailPosition
	| WikiOireachtasPosition
	| WikiSeanadPosition
	| WikiPartyPosition
	| WikiEuroPosition
	| WikiLocalPosition
	| 'other';

export type WikiPosition = {
	name: string;
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
	isIncompleteBirthDate?: boolean;
	positions?: WikiPosition[];
	education?: WikiURIpair[];
	almaMater?: WikiURIpair[];
	// marriageDetails?: string[];
	// domesticPartner?: string;
	numOfChildren?: number;
	relatives?: WikiURIpair[];
	websiteUrl?: string;
};
