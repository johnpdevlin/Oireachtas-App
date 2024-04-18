/** @format */

import { DateRangeStr } from '../../dates';
import { AllMemberBioData } from '../../member/_all_bio_data';
import { AttendanceData } from '../attendance';

type ExcludeKeys =
	// API
	| 'firstName'
	| 'lastName'
	| 'constituencies'
	| 'parties'
	| 'dateOfDeath'
	| 'isActiveSenator'
	| 'isActiveTD'
	| 'isActiveSeniorMinister'
	| 'isActiveJuniorMinister'
	| 'committees'
	// WIKI
	| 'wikiName'
	| 'wikiURI'
	| 'birthDate'
	| 'birthCountry'
	| 'marriageDetails'
	| 'numOfChildren'
	| 'education'
	| 'almaMater'
	| 'websiteURL'
	| 'offices';

export type MemberPageMembership = {
	name: string;
	dateRange: DateRangeStr;
} & Record<string, unknown>;

export type MemberPageBioData = Omit<AllMemberBioData, ExcludeKeys> & {
	// API
	committees?: {
		current?: MemberPageMembership[];
		past?: MemberPageMembership[];
	};
	constituencies: {
		dail?: MemberPageMembership[];
		seanad?: MemberPageMembership[];
		other?: MemberPageMembership[];
	};
	parties: MemberPageMembership[];
	offices?: MemberPageMembership[];
	// WIKI
	partyPositions?: MemberPageMembership[];
	otherPositions?: MemberPageMembership[];
	birthDate?: string;
	education?: string[];
	almaMater?: string[];
	created?: string;
};

export type TDpageData = {
	bio: MemberPageBioData;
	attendance: AttendanceData;
};
