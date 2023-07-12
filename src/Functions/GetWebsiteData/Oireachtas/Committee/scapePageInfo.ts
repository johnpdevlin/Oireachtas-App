/** @format */
import { removeDuplicateObjects } from '@/Functions/Util/arrays';
import { CommitteeType, URIpair } from '@/Models/_utility';
import { Committee, PastCommitteeMember } from '@/Models/committee';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Cheerio, CheerioAPI } from 'cheerio';
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from './scrapeAllCommittees';

// Fetches all committees, scrapes individual pages and returns info
export default async function getAllCommitteeInfo(): Promise<Committee[]> {
	// Get all committee base details
	const allCommitteesBaseDetails = await scrapeCommitteesBaseDetails();

	// Get details for members of committee and other details
	const committees = await allCommitteesBaseDetails.reduce(
		async (resultsPromise: Promise<Committee[]>, c: BaseCommittee) => {
			const results = await resultsPromise;
			const info = await scrapeCommitteePageInfo(c.dailNo, c.uri);
			if (info?.name) {
				results.push(info);
			} else {
				console.error('Issue with committee scraping:', c.uri);
			}
			return results;
		},
		Promise.resolve([])
	);
	return committees;
}

//Scrape committee information from the given URL.
export async function scrapeCommitteePageInfo(
	house_no: number,
	uri: string
): Promise<Committee | undefined> {
	const url = `https://www.oireachtas.ie/en/committees/${house_no.toString()}/${uri}/`;
	if (!url) throw new Error('No URL provided');

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

	// Fetch the membership page
	try {
		response = (await axios.get(`api/webscrape?url=${url}membership/`)).data
			.text;
	} catch (err) {
		// If membership URL format is different, try the alternative
		try {
			response = (await axios.get(`api/webscrape?url=${url}members/`)).data
				.text;
		} catch (err) {
			// Case for one special covid committee
			return undefined;
		}
	}

	$ = cheerio.load(response);

	// Extract committee information
	const committeeName = $('.c-hero__subtitle').text().trim();
	const chamber = uri.includes('seanad') ? 'seanad' : 'dail';
	const committeeTypes = (): CommitteeType[] => {
		const types: CommitteeType[] = [];
		if ($('#joint').length > 0) types.push('joint');
		if ($('#select').length > 0) types.push('select');
		if ($('#standing').length > 0)
			if (uri.includes('dáil') || uri.includes('seanad')) types.push('select');
			else types.push('standing');
		return types;
	};

	const members = getMembers($);
	const chair = getChair($) as URIpair;
	const pastMembers = getPastMembers($);

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

// Extract member URIs from the committee page.
function getMembers($: CheerioAPI): URIpair[] {
	const members: URIpair[] = [];
	$('.committee_member_link').each((_index, element) => {
		const memberName = $(element).text().trim();
		const memberURI = $(element)
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as string;
		members.push({ name: memberName, uri: memberURI });
	});

	// Remove duplicates
	const uniqueMembers = removeDuplicateObjects(members) as URIpair[];
	return uniqueMembers;
}

// Extract the chair
function getChair($: CheerioAPI): URIpair | undefined {
	let chair: URIpair | undefined;
	$('.member_box').each((_index, element) => {
		if ($(element).find('.committee_member_chair').length > 0) {
			const name = $(element).find('.committee_member_link').text().trim();
			const uri = $(element)
				.find('.committee_member_link')
				.attr('href')
				?.split('r/')[1]
				?.replace('/', '') as string;
			chair = { name, uri };
		}
	});
	return chair;
}

// Extract past committee members from the committee page.
function getPastMembers($: CheerioAPI): PastCommitteeMember[] | undefined {
	const pastMembers: PastCommitteeMember[] = [];
	$('.member_box_bottom-history.current-print').each((_index, element) => {
		const name = $(element).find('.committee_member_link').text().trim();
		if (name.length === 0) return;

		const memberURI = $(element)
			.find('.committee_member_link')
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as string;

		// Format Dates
		const dateText = $(element).find('p > i').text().trim();
		const [startMonth, startYear, endMonth, endYear] = dateText
			.split('-')
			.map((str) => str.trim());
		const date_start = new Date(`${startYear}-${startMonth}-01`);
		const date_end = new Date(`${endYear}-${endMonth}-01`);

		if (!date_start.getTime() || !date_end.getTime()) {
			console.log(dateText);
		}

		pastMembers.push({
			name,
			uri: memberURI,
			dateRange: { date_start, date_end },
		});
	});

	// Remove duplicates
	const uniquePastMembers = removeDuplicateObjects(
		pastMembers
	) as PastCommitteeMember[];
	return uniquePastMembers.length > 0 ? uniquePastMembers : undefined;
}

// Remove past members from the array of current members.
function removePastMembers(
	members: URIpair[],
	pastMembers: PastCommitteeMember[] | undefined
): URIpair[] {
	if (!pastMembers) return members;
	return members.filter((member) =>
		pastMembers.every((pastMember) => pastMember.uri !== member.uri)
	);
}
