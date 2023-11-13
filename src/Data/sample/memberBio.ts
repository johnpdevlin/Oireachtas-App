/** @format */

import { MemberBioData } from '@/functions/processes/td/get/all_td_details';
import { MemberURI } from '@/models/_utils';

const member: MemberBioData = {
	fullName: 'Joe Blogg',
	firstName: 'Joe',
	lastName: 'Blogg',
	dateOfDeath: undefined,
	gender: 'Male',
	address:
		'Unit 1, Old Quarry Campus, Kilshane Park, Northwest Business Park, Blanchardstown, Dublin 15, D15 A337',
	uri: 'Leo-Varadkar.D.2007-06-14' as MemberURI,
	constituencies: {
		dail: [
			{
				name: 'Dublin West',
				uri: 'Dublin West',
				dateRange: { start: '2011-02-25', end: undefined },
				houses: [31, 32, 33],
				chamber: 'dail',
			},
			{
				name: 'Trinity',
				uri: 'TCD',
				dateRange: { start: '2006-02-25', end: '2010-01-09' },
				houses: [],
				chamber: 'seanad',
			},
			{
				name: 'Galway South',
				uri: 'GS',
				dateRange: { start: '2001-02-25', end: '2006-01-09' },
				houses: [],
				chamber: 'dail',
			},
		],
		seanad: [],
	},
	isActiveSenator: false,
	isActiveTD: true,
	parties: [
		{
			name: 'Social Democrats',
			uri: 'Social Democrats',
			dateRange: { start: '2017-01-02', end: undefined },
			houses: [33],
		},
		{
			name: 'Fianna Fáil',
			uri: 'Fianna Fáil',
			dateRange: { start: '2015-01-01', end: '2017-01-01' },
			houses: [32],
		},
	],
	offices: [
		{
			name: 'Minister of State for Horses and Ponies',
			type: 'junior',
			chamber: 'dail',
			houseNo: 32,
			chamberStr: 'dail-32',
			dateRange: { start: '2016-01-01', end: '2019-01-25' },
		},
		{
			name: 'Minister for Mayhem',
			type: 'senior',
			chamber: 'dail',
			houseNo: 33,
			chamberStr: 'dail-33',
			dateRange: { start: '2020-01-01', end: undefined },
		},
	],
	isActiveSeniorMinister: true,
	isActiveJunior: false,
	wikiName: 'Leo Varadkar',
	wikiURI: 'Leo Varadkar',
	birthdate: '1979-01-18',
	birthplace: 'Dublin',
	birthCountry: 'Ireland',
	education: "St Flannan's College, Ennis, Co Clare",
	educationWikiID: 'link',
	almaMater: 'Trinity College Dublin',
	almaMaterWikiID: 'Trinity College Dublin',
	websiteUrl: 'https://www.leovaradkar.ie/',
	committees: {
		current: [
			{
				name: 'Committee for Dogs and Cats Preservation',
				uri: 'Committee for Dogs and Cats Preservation',
				chamber: 'dail',
				houseNo: 33,
				dateRange: { start: '2020-01-01', end: undefined },
			},
			{
				name: 'Committee for Surveillance of Equine Affairs',
				uri: 'Committee for Surveillance of Equine Affairs',
				chamber: 'dail',
				houseNo: 33,
				dateRange: { start: '2020-01-01', end: undefined },
			},
		],
		past: [
			{
				name: 'Committee for National Dog Security',
				uri: 'Committee for Surveillance of Equine Affairs',
				chamber: 'dail',
				houseNo: 33,
				dateRange: { start: '2020-01-01', end: '2021-01-01' },
			},
		],
	},
	contactNumbers: ['065-682-8341', '086-123-4567'],
	email: 'joe.bloggs@oireachtas.ie',
	webpages: [
		{
			website: 'Facebook',
			url: 'https://www.facebook.com/LeoVaradkar',
		},
		{
			website: 'Twitter',
			url: 'https://twitter.com/',
		},
	],
};

export default member;
