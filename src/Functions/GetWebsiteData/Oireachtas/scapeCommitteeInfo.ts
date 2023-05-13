/** @format */

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
	chair: string;
	currentMembers: string[];
	pastMembers: PastMember[];
};

export default async function getCommitteeInfo(
	url: string
): Promise<Committee> {
	const response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	const $ = cheerio.load(response);

	// Get the committee name
	const committeeName = $('.c-hero__subtitle').text().trim();
	let currentMembers: string[] = [];
	const pastMembers: PastMember[] = [];
	let chair: string = '';

	// Get the current members
	$('.committee_member_link').each((index, element) => {
		const memberName = $(element).text().trim();
		currentMembers.push(memberName);
	});

	$('.member_box').each((i, el) => {
		if ($(el).find('.committee_member_chair').length > 0) {
			chair = $(el).find('.committee_member_link').text().trim();
		}
	});

	// Get the past members
	$('.member_box_bottom-history.current-print').each((index, element) => {
		const name = $(element).find('.committee_member_link').text();

		// Formatting Dates
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

	const committee: Committee = {
		name: committeeName,
		chair,
		currentMembers,
		pastMembers,
	};
	return committee;
}
