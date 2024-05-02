/** @format */

export type RawMemberInterests = {
	name?: string;
	occupations?: RawInterest[];
	shares?: RawInterest[];
	directorships?: RawInterest[];
	property?: RawInterest[];
	gifts?: RawInterest[];
	travel?: RawInterest[];
	benefitsReceived?: RawInterest[];
	renumeratedPositions?: RawInterest[];
	contracts?: RawInterest[];
};

export type RawInterest = {
	details: string;
	otherInfo: string;
};

// export type DirectorshipType =
// 	| 'Chair'
// 	| 'Non-Executive Director'
// 	| 'Voluntary Director'
// 	| 'Executive Director'
// 	| 'Defacto Director'
// 	| 'Shadow Director'
// 	| 'Director'
// 	| 'Director & PRO';

// export const interestsArray = [
// 	{ id: 'property', title: 'Property Etc.' },
// 	{ id: 'shares', title: 'Shares Etc' },
// 	{ id: 'directorships', title: 'Directorships' },
// 	{
// 		id: 'servicesSupplied',
// 		title: 'Property supplied or lent or a Service supplied',
// 	},
// 	{ id: 'contracts', title: 'Contracts' },
// 	{ id: 'travel', title: 'Travel Facilities' },
// 	{ id: 'gifts', title: 'Gifts' },
// 	{ id: 'occupations', title: 'Occupations' },
// 	{ id: 'remuneratedPositions', title: 'Renumerated Positions' },
// ];

// export const InterestTitles = [
// 	'Occupations Etc.',
// 	'Shares Etc.',
// 	'Directorships',
// 	'Property',
// 	'Gifts',
// 	'Property supplied or lent or a Service supplied',
// 	'Travel Facilities',
// 	'Renumerated Positions',
// 	'Contracts',
// ] as const;

// export interface Interest {
// 	memberUri: string;
// 	details: string;
// 	additionalDetails?: string;
// 	dateRegistered: Date;
// 	relevantYear: number;
// 	url: string;
// }

// export interface Directorship {
// 	memberUri: string;
// 	name: string;
// 	address?: string;
// 	type?: DirectorshipType;
// 	isVoluntary?: boolean;
// 	details?: string;
// 	additionalDetails?: string;
// 	relevantYear: number;
// 	dateRegistered: Date;
// 	url: string;
// }

// export type PropertyType =
// 	| 'Commercial'
// 	| 'Residential'
// 	| 'Constituency Office'
// 	| 'Private Residence'
// 	| 'Private Site'
// 	| 'Development Land'
// 	| 'Residence Held in Trust'
// 	| 'Renovation'
// 	| 'In Probate'
// 	| 'Derelict'
// 	| 'Property Sold'
// 	| 'Farmland';

// export interface Property {
// 	memberUri: string;
// 	address: string;
// 	type: PropertyType;
// 	details?: string;
// 	additionalDetails?: string;
// 	relevantYear: number;
// 	numOfResidentailProperties?: number | undefined;
// 	numOfCommercialProperties?: number | undefined;
// 	isVacant?: boolean;
// 	isDerelict?: boolean;
// 	isRented?: boolean;
// 	dateRegistered: Date;
// 	url: string;
// }

// export interface Contract {
// 	memberUri: string;
// 	details: string;
// 	responsibleParty?: string;
// 	contractingParty?: string;
// 	additionalDetails?: string;
// 	relevantYear: number;
// 	dateRegistered: Date;
// 	url: string;
// }

// export interface Travel {
// 	memberUri: string;
// 	purpose: string;
// 	sponsor: string;
// 	additionalDetails?: string;
// 	relevantYear: number;
// 	dateRegistered: Date;
// 	url: string;
// }

// export interface Occupation {
// 	memberUri: string;
// 	company?: string;
// 	position: string;
// 	additionalDetails?: string;
// 	address: string;
// 	relevantYear: number;
// 	dateRegistered: Date;
// 	url: string;
// }

// export interface Shares {
// 	memberUri: string;
// 	name: string;
// 	address: string;
// 	type: string;
// 	relevantYear: number;
// 	dateRegistered: Date;
// 	url: string;
// }
