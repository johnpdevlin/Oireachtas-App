/** @format */

import { OfficeType } from '@/models/oireachtas_api/Formatted/Member/office';
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
	uri: string;
	type: string;
};

export type MemberPageBioData = Omit<AllMemberBioData, ExcludeKeys> & {
	// API
	committees?: {
		current?: MemberPageMembership[];
		past?: MemberPageMembership[];
	};
	constituencies: {
		dail?: (MemberPageMembership & { uri: string })[];
		seanad?: (MemberPageMembership & { uri: string })[];
		other?: MemberPageMembership[];
	};
	parties: (MemberPageMembership & { uri: string })[];
	offices?: (MemberPageMembership & { type: OfficeType })[];
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
