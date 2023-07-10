/** @format */

import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import axios from 'axios';
import * as cheerio from 'cheerio';

type PastMember = {
	name: string;
	dateRange: {
		date_start: Date;
		date_end: Date;
	};
};

type Committee = {
	name: string;
	uri: string;
	url: string;
	house_no: number;
	chair: string;
	currentMembers: string[];
	pastMembers?: PastMember[];
} & Partial<ExpiredDetails>;

type ExpiredDetails = {
	historicText: string;
	successorUrl?: string;
	endDate?: Date | undefined;
};

export default async function scrapeCommitteeInfo(
	house_no: string | number,
	uri: string
): Promise<Committee | undefined> {
	try {
		if (typeof house_no !== 'string') {
			house_no = house_no.toString();
		}

		const url = `https://www.oireachtas.ie/en/committees/${house_no}/${uri}/`;
		if (!url) throw new Error('No url provided');

		/// NEED TO FIX THIS
		/// match uri to names below
		const dailMembers = fetchMembers({ chamber: 'dail', house_no: 33 });

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
			console.warn(
				'Error occurred, must be inconsistent formatting on page. \n Alternative url pattern now attemped.'
			);
			response = (await axios.get(`api/webscrape?url=${url}members/`)).data
				.text;
		}
		$ = cheerio.load(response);

		// Get the committee name
		let committeeName = $('.c-hero__subtitle').text().trim();
		let currentMembers: string[] = [];
		let chair: string = '';

		// Extract the current members
		$('.committee_member_link').each((index, element) => {
			const memberName = $(element).text().trim();
			currentMembers.push(memberName);
		});

		$('.member_box').each((i, el) => {
			if ($(el).find('.committee_member_chair').length > 0) {
				chair = $(el).find('.committee_member_link').text().trim();
			}
		});

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
			uri,
			url,
			house_no: parseInt(house_no),
			chair,
			currentMembers,
			pastMembers,
			...(historicText && { historicText }),
			...(successorUrl && { successorUrl }),
			...(endDate && { endDate }),
		};

		return committee;
	} catch (error) {
		console.error('Error occurred during scraping:', error);
	}
}
