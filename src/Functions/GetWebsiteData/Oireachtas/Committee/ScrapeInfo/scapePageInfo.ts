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
import scrapeCommitteesBaseDetails, {
	BaseCommittee,
} from './scrapeAllCommittees';
import fetchMembers from '@/Functions/API-Calls/OireachtasAPI/members';
import { RawMember, RawOuterMembership } from '@/Models/OireachtasAPI/member';

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
	console.log(committees);
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

	try {
		// Attempt to fetch the membership page from the first URL format
		response = (await axios.get(`api/webscrape?url=${url}membership/`)).data
			.text;
	} catch (err1) {
		try {
			// If the first URL format fails, try the alternative format
			response = (await axios.get(`api/webscrape?url=${url}members/`)).data
				.text;
		} catch (err2) {
			// If both URL formats fail, handle the error gracefully and return undefined
			console.error('Error fetching membership page:', err2);
			return;
		}
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

// Extract member URIs and houseCodes from the committee page.
function getMembers(
	$: CheerioAPI,
	allMembers: RawMember[],
	excpDate?: Date
): { dail?: MemberBaseKeys[]; seanad?: MemberBaseKeys[] } {
	const dailMembers: MemberBaseKeys[] = [];
	const seanadMembers: MemberBaseKeys[] = [];
	$('.committee_member_link').each((_index, element) => {
		const name = $(element).text().trim();
		const uri = $(element)
			.attr('href')
			?.split('r/')[1]
			?.replace('/', '')
			.trim() as string;
		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);

		if (!name || !uri) return;

		// Find Member's houseCode and push to that array
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			excpDate ? excpDate : undefined
		) as BinaryChamber;
		const memberObj = {
			name,
			uri,
			houseCode,
		};

		if (houseCode === 'seanad') seanadMembers.push(memberObj);
		else if (houseCode === 'dail') dailMembers.push(memberObj);
	});

	return {
		...(dailMembers?.length > 0 && {
			dail: removeDuplicateObjects(dailMembers),
		}),
		...(seanadMembers?.length > 0 && {
			seanad: removeDuplicateObjects(seanadMembers),
		}),
	};
}

// Parses memberships to find relevant housecode
function getHouseCode(
	memberships: RawOuterMembership[],
	date_start?: Date,
	date_end?: Date,
	excpDate?: Date
): BinaryChamber | undefined {
	let relevantMembership:
		| { houseCode: BinaryChamber; endDate: number | null }
		| undefined;

	const ms = memberships.map((mem: RawOuterMembership) => {
		return mem.membership;
	});
	ms?.forEach((membership) => {
		if (ms.length === 1) {
			relevantMembership = {
				houseCode: membership.house.houseCode,
				endDate: null,
			};
		} else {
			const endDate = membership.dateRange.end!
				? new Date(membership.dateRange.end).getTime()
				: null;

			if (relevantMembership?.endDate !== null) {
				if (
					date_start &&
					date_end &&
					endDate! &&
					date_start?.getTime() >=
						new Date(membership.dateRange.start).getTime() &&
					date_end?.getTime() <= endDate
				) {
					// Deals with past members
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (!excpDate && endDate === null) {
					// If no excpetions and endDate is 0 (undefined)
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (
					!relevantMembership ||
					endDate! > relevantMembership.endDate!
				) {
					if (!excpDate || excpDate.getTime() > endDate!) {
						relevantMembership = {
							houseCode: membership.house.houseCode,
							endDate: endDate,
						};
					}
				}
			}
		}
	});

	return relevantMembership?.houseCode;
}

// Extract the chair
function getChair(
	$: CheerioAPI,
	allMembers: RawMember[],
	excpDate?: Date
): MemberBaseKeys | undefined {
	let chair: MemberBaseKeys | undefined;
	$('.member_box').each((_index, element) => {
		if ($(element).find('.committee_member_chair').length > 0) {
			const name = $(element).find('.committee_member_link').text().trim();
			const uri = $(element)
				.find('.committee_member_link')
				.attr('href')
				?.split('r/')[1]
				?.replace('/', '') as string;
			const memberDetails = allMembers.find(
				(member) => member.memberCode === uri
			);
			const houseCode = getHouseCode(
				memberDetails!.memberships,
				excpDate ? excpDate : undefined
			) as BinaryChamber;
			chair = { name, uri, houseCode };
		}
	});
	return chair;
}

// Extract past committee members from the committee page.
function getPastMembers(
	$: CheerioAPI,
	allMembers: RawMember[]
): { dail?: PastCommitteeMember[]; seanad?: PastCommitteeMember[] } {
	const dailMembers: PastCommitteeMember[] = [];
	const seanadMembers: PastCommitteeMember[] = [];
	$('.member_box_bottom-history.current-print').each((_index, element) => {
		const name = $(element).find('.committee_member_link').text().trim();
		if (name.length === 0) return;

		const uri = $(element)
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

		const memberDetails = allMembers.find(
			(member) => member.memberCode === uri
		);
		const houseCode = getHouseCode(
			memberDetails!.memberships,
			date_start,
			date_end
		) as BinaryChamber;

		const memberObj = {
			name,
			uri,
			dateRange: { date_start, date_end },
			houseCode,
		};

		if (
			houseCode === 'seanad' &&
			(!seanadMembers || !checkForPastDuplicates(seanadMembers, uri, date_end))
		) {
			seanadMembers.push(memberObj);
		} else if (
			houseCode === 'dail' &&
			(!dailMembers || !checkForPastDuplicates(dailMembers, uri, date_end))
		) {
			dailMembers.push(memberObj);
		}
	});

	return {
		...(dailMembers.length > 0 && {
			dail: dailMembers,
		}),
		...(seanadMembers.length > 0 && {
			seanad: seanadMembers,
		}),
	};
}

function checkForPastDuplicates(
	members: PastCommitteeMember[],
	uri: string,
	date_end: Date
): Boolean {
	if (
		members.some(
			(sm) =>
				sm.uri === uri &&
				sm.dateRange.date_end.getFullYear() === date_end.getFullYear() &&
				!(Math.abs(sm.dateRange.date_end.getMonth() - date_end.getMonth()) >= 1)
		)
	) {
		return true;
	}
	return false;
}

// Remove past members from the array of current members.
function removePastMembers(
	members: CommitteeMembers,
	pastMembers: CommitteeMembers
): CommitteeMembers {
	let dailMembers;
	let seanadMembers;

	if (members.dail && pastMembers.dail) {
		dailMembers = members.dail.filter(
			(x) => !pastMembers.dail?.some((y) => y.uri === x.uri)
		);
	}
	if (members.seanad && pastMembers.seanad) {
		seanadMembers = members.seanad.filter(
			(x) => !pastMembers.seanad?.some((y) => y.uri === x.uri)
		);
	}
	return {
		...(dailMembers!
			? {
					dail: dailMembers,
			  }
			: { dail: members.dail }),
		...(seanadMembers!
			? {
					seanad: seanadMembers,
			  }
			: { seanad: members.seanad }),
	};
}
