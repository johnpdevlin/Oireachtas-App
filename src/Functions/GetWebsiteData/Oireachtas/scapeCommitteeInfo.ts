/** @format */

import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { Chamber, ChamberType, CommitteeType } from '@/Models/_utility';
import axios from 'axios';
import * as cheerio from 'cheerio';

type PastMember = {
	name: string;
	dateRange: {
		date_start: Date;
		date_end: Date;
	};
};

export type Committee = {
	name: string;
	uri: string;
	url: string;
	house: Exclude<Chamber, 'dail & seanad'>;
	types: CommitteeType[];
	dail_no: number;
	chair: string;
	currentMembers: string[];
	pastMembers?: PastMember[];
} & Partial<ExpiredDetails>;

type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
	endDate: Date;
};

export default async function scrapeCommitteeInfo(
	house_no: string | number,
	uri: string
): Promise<Committee | undefined> {
	if (typeof house_no !== 'string') {
		house_no = house_no.toString();
	}

	const url = `https://www.oireachtas.ie/en/committees/${house_no}/${uri}/`;
	if (!url) throw new Error('No url provided');

	let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	let $ = cheerio.load(response);

	// Extract the historic element
	const historic: cheerio.Cheerio<cheerio.Element> | undefined = $(
		'.c-historic-committee-ribbon__message'
	);
	let historicText: string | undefined;
	let successorUrl: string | undefined;
	let endDate: Date | undefined;

	// Check if historic element exists and extract relevant information
	if (historic !== undefined) {
		historicText = historic.text().trim();
		successorUrl = historic.attr('href');
		endDate = new Date($('.c-historic-committee-ribbon__date').text().trim());
	}

	try {
		response = (await axios.get(`api/webscrape?url=${url}membership/`)).data
			.text;
	} catch (err) {
		response = (await axios.get(`api/webscrape?url=${url}members/`)).data.text;
	}
	$ = cheerio.load(response);

	// Get the committee name
	let committeeName = $('.c-hero__subtitle').text().trim();
	let currentMembers: string[] = [];
	let chair: string = '';
	const house = (): Exclude<Chamber, 'dail & seanad'> => {
		if (uri.includes('seanad')) return 'seanad';
		else return 'dail';
	};

	// Extract the current members
	$('.committee_member_link').each((index, element) => {
		const memberName = $(element).text().trim();
		currentMembers.push(memberName);
	});

	$('.member_box').each((i, el) => {
		// Get chair
		if ($(el).find('.committee_member_chair').length > 0) {
			chair = $(el).find('.committee_member_link').text().trim();
			currentMembers.push(chair);
		}
	});

	const committeeTypes = (): CommitteeType[] => {
		const types: CommitteeType[] = [];
		if ($('#joint').length > 0) types.push('joint');
		if ($('#select').length > 0) types.push('select');
		if ($('#standing').length > 0) types.push('standing');

		return types;
	};

	const pastMembers: PastMember[] | undefined = [];
	if (endDate !== undefined) {
		// Extract the past members
		$('.member_box_bottom-history.current-print').each((index, element) => {
			const name = $(element).find('.committee_member_link').text();

			// Format Dates
			const dateText = $(element).find('p > i').text().trim();
			const [startMonth, startYear, endMonth, endYear] = dateText
				.split('-')
				.map((str) => str.trim());

			const date_start = new Date(`${startMonth} 01, ${startYear}`);
			const date_end = new Date(`${endMonth} 01, ${endYear}`);

			pastMembers.push({ name, dateRange: { date_start, date_end } });
		});

		// Remove past members from the array of current members
		currentMembers = currentMembers.filter((member) =>
			pastMembers.every((pastMember) => pastMember.name !== member)
		);
	}

	// Create the Committee object with the extracted information
	const committee: Committee = {
		name: committeeName,
		uri: uri,
		url,
		types: committeeTypes(),
		house: house(),
		dail_no: parseInt(house_no),
		chair,
		currentMembers,
		pastMembers,
		...(historicText && { historicText }),
		...(successorUrl && { successorUrl }),
		...(endDate && { endDate }),
	};

	if (committee.house == 'seanad') console.log(committee);
	return committee;
}
