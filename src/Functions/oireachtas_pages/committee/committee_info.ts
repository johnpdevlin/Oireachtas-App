/** @format */
import { Committee } from '@/models/committee';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Cheerio } from 'cheerio';
import { RawMember } from '@/models/oireachtasApi/member';
import exceptions from '@/Data/committee-url-pattern-exceptions.json';
import { getCommitteeTypes } from './parse/committee_types';
import { getDateRange } from './parse/date_range';
import { handleMembers } from './parse/members/_handle_members';

//Scrape committee information from the given URL.
export async function scrapeCommitteePageInfo(
	house_no: number,
	uri: string,
	rawMembers?: RawMember[]
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

	const dateRange = getDateRange($)!;

	// Gets successor url / expiry details
	const historic: Cheerio<cheerio.Element> | undefined = $(
		'.c-historic-committee-ribbon__message'
	);
	let historicText: string | undefined;
	let successorUrl: string | undefined;
	if (historic.text().length > 0) {
		historicText = historic.text().trim();
		successorUrl =
			'https://www.oireachtas.ie' + historic.find('a').attr('href');
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

	const committeeTypes = getCommitteeTypes($, uri);

	const { members, pastMembers, chair } = await handleMembers(
		$,
		dateRange,
		rawMembers
	);

	// Create the Committee object with the extracted information
	const committee: Committee = {
		name: committeeName,
		uri,
		url,
		chamber,
		types: committeeTypes,
		dail_no: house_no,
		chair,
		members: members,
		dateRange,
		...(pastMembers && { pastMembers }),
		...(historicText && { historicText }),
		...(successorUrl && historicText?.includes('renamed')! && { successorUrl }),
	};

	return committee;
}
