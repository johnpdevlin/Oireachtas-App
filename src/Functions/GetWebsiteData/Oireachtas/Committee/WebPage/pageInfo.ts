/** @format */
import { removeDuplicateObjects } from '@/Functions/Util/arrays';
import {
	BinaryChamber,
	CommitteeType,
	MemberBaseKeys,
} from '@/Models/_utility';
import {
	Committee,
	CommitteeMembers,
	PastCommitteeMember,
} from '@/Models/committee';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Cheerio, CheerioAPI } from 'cheerio';
import scrapeCommitteesBaseDetails, { BaseCommittee } from './baseDetails';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { RawMember, RawOuterMembership } from '@/Models/OireachtasAPI/member';
import {
	getMembers,
	getChair,
	getPastMembers,
	removePastMembers,
} from './parseDetails';
import exceptions from '@/Data/BackendPocesses/committeeScraping.json';
//Scrape committee information from the given URL.
export async function scrapeCommitteePageInfo(
	house_no: number,
	uri: string
): Promise<Committee | undefined> {
	const url = `https://www.oireachtas.ie/en/committees/${house_no.toString()}/${uri}/`;
	if (!url) throw new Error('No URL provided');
	if (exceptions.urlPatterns.skip.includes(uri)) {
		console.error(
			`'${uri}' is / was not a standard committee and will be skipped`
		);
		return;
	}

	let response: string;
	let $: cheerio.CheerioAPI;

	// Fetch the committee page
	try {
		response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		$ = cheerio.load(response);
	} catch (err) {
		return undefined;
	}

	// Extract the historic information
	const historic: Cheerio<cheerio.Element> | undefined = $(
		'.c-historic-committee-ribbon__message'
	);
	let historicText: string | undefined;
	let successorUrl: string | undefined;
	let endDate: Date | undefined;

	if (historic.text().length > 0) {
		historicText = historic.text().trim();
		successorUrl =
			'https://www.oireachtas.ie' + historic.find('a').attr('href');
		endDate = new Date($('.c-historic-committee-ribbon__date').text().trim());
	}

	// url patterns have inconsistent pattern
	let pattern = 'membership';
	if (exceptions.urlPatterns.members.includes(uri)) pattern = 'members';

	try {
		// Attempt to fetch the membership page from the first URL format
		response = (await axios.get(`api/webscrape?url=${url}${pattern}/`)).data
			.text;
	} catch (err) {
		// If both URL formats fail, handle the error gracefully and return undefined
		console.error('Error fetching membership page:', err);
		return;
	}

	$ = cheerio.load(response);

	// Extract committee information
	const committeeName = $('.c-hero__subtitle').text().trim();
	const chamber = committeeName.toLowerCase().includes('seanad')
		? 'seanad'
		: 'dail';
	const committeeTypes = (): CommitteeType[] => {
		const types: CommitteeType[] = [];
		if ($('#joint').length > 0) types.push('joint');
		if ($('#select').length > 0) types.push('select');
		if ($('#standing').length > 0)
			if (uri.includes('dáil') || uri.includes('seanad')) types.push('select');
			else types.push('standing');
		return types;
	};

	let excpDate;
	if (endDate) {
		excpDate = endDate;
	}

	const allMembers = (await fetchMembers({ formatted: false })) as RawMember[]; // For parsing purposes

	const members = getMembers($, allMembers, excpDate ? excpDate : undefined);
	const chair = getChair(
		$,
		allMembers,
		excpDate ? excpDate : undefined
	) as MemberBaseKeys;

	const pastMembers = getPastMembers($, allMembers);

	// Remove past members from the array of current members
	const filteredMembers = removePastMembers(members, pastMembers);

	// Create the Committee object with the extracted information
	const committee: Committee = {
		name: committeeName,
		uri,
		url,
		types: committeeTypes(),
		chamber,
		dail_no: house_no,
		chair,
		members: filteredMembers,
		...(pastMembers && { pastMembers }),
		...(historicText && { historicText }),
		...(successorUrl && { successorUrl }),
		...(endDate && { endDate }),
	};

	return committee;
}
