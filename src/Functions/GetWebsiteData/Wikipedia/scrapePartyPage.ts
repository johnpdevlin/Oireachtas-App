/** @format */

import axios from 'axios';
import * as cheerio from 'cheerio';
import {
	getInfoBoxTitle,
	getInfoBoxHref,
	getInfoBoxText,
	getListByTHtitle,
	removeSquareFootnotes,
	getNextTableElAfterH2text,
	getNextTableElAfterH3text,
	parseTableToObjects,
	getNextTableElAfterH4text,
} from './util';

import { extractDateFromDmonthYstring } from '@/Functions/Util/dates';
import { parseDailElectionTable } from './fncParseDailElectionTable';
import {
	extractNumberFromString,
	hasLowerUpperCasePattern,
	splitByLowerUpperCase,
	validateStandardName,
} from '@/Functions/Util/strings';
import {
	isArrayOnlyValues,
	removeDuplicateObjects,
} from '@/Functions/Util/arrays';

export type ElectionData = {
	election: number | string;
	firstPrefs: number;
	percentage: number;
	rank?: number;
	seats: { total: number; outOf: number; change: number };
};

export type DailElectionData = {
	leader?: string | string[];
	government: string | string[];
} & ElectionData;

type Founder = string | string[] | { name: string; note: string }[];
type DateFounded =
	| Date
	| { date: Date; note: string }
	| { date: Date; note: string }[];

export type Seats = {
	total: number;
	outOf: number;
	change: number;
};
export type PartyData = {
	name: string;
	leader: string | string[];
	deputyLeader: string;
	niLeader?: string;
	chairperson?: string;
	viceChairperson?: string;
	generalSecretary?: string;
	parliamentaryChairperson: string;
	seanadLeader?: string;
	dateFounded: DateFounded;
	founder: Founder;
	splitFrom?: string;
	mergerOf?: string;
	precededBy?: string | string[];
	ideology: string | string[];
	politicalPosition: string;
	headquarters?: string;
	youthWing?: string;
	youthWingURI?: string;
	lgbtWing?: string;
	membership?: number;
	membershipYear?: number;
	europeanParliamentGroup?: string;
	colours?: string[];
	frontbench?: unknown[];
	partyLeaders: unknown[];
	deputyLeaders: unknown[];
	seanadLeaders: unknown[];
	website: string;
	wikiURI: string;
	frontBenchWikiURI?: string;
	electionResults: { dail: DailElectionData[]; european?: unknown[] };
};

export function formatPartyObject(obj: PartyData): PartyData {
	// Format the provided object
	const formattedObj: PartyData = Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			let modifiedValue = value;

			if (typeof value === 'string') {
				// Format the string value
				modifiedValue = removeSquareFootnotes(value.trim())!
					.replace(/\\/g, '') // Remove backslashes
					.replace(/"/g, '') // Remove double quotes
					.replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
					.trim();
			}

			if (Array.isArray(value)) {
				if (!isArrayOnlyValues(value)) {
					// If the array contains objects, recursively format each object
					modifiedValue = value.map((item) =>
						typeof item === 'object' ? formatPartyObject(item) : item
					);
				}
			}

			return [key, modifiedValue];
		})
	);

	return formattedObj;
}

export default async function scrapeWikiPartyPage(
	wikiURI: string
): Promise<PartyData> {
	const url = `https://en.wikipedia.org${wikiURI}`;
	// ff ideology
	// sf election results
	// sf founder
	// filter partyLeaders array
	//greens local election results, partyLeaders

	// ff format party leaders // remove portrait and parse terms
	// soc dem dail election results leaders // ideology
	// fg dail election leaders (first few)

	let response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	const $ = cheerio.load(response);

	// Parse party name
	const name = $('h1#firstHeading').text();

	// Parse leadership positions
	let leader = getInfoBoxText($, 'Leader');
	if (name === 'Sinn Féin') {
		leader = getInfoBoxText($, 'President');
	}

	const niLeader = getInfoBoxHref($, 'Northern Ireland Leader');
	let deputyLeader = getInfoBoxText($, 'Deputy Leader');
	if (name === 'Sinn Féin') {
		deputyLeader = getInfoBoxText($, 'Vice President');
	}
	const chairperson = removeSquareFootnotes(
		getInfoBoxText($, 'Chairman')
			? getInfoBoxText($, 'Chairman')!
			: getInfoBoxText($, 'Chairperson')!
	);
	const viceChairperson = getInfoBoxText($, 'Vice-chair');
	const parliamentaryChairperson = getInfoBoxText(
		$,
		'Parliamentary Party Chairperson'
	);
	const generalSecretary = getInfoBoxText($, 'General Secretary');
	const seanadLeader = getInfoBoxText($, 'Seanad Leader');
	const frontBenchWikiURI = $(`a:contains("Front Bench")`).attr('href');

	// Parse foundation info
	let founder: string | undefined | string[] = getInfoBoxText($, 'Founder');
	if (!founder || validateStandardName(founder) === false) {
		founder = getListByTHtitle($, 'Founders');
	}

	const dateFounded = extractDateFromDmonthYstring(
		getInfoBoxText($, 'Founded')!
	);

	// Parse split / merger / preceded by orgs
	let splitFrom: string | string[] | undefined = getInfoBoxText($, 'Split');
	if (splitFrom === undefined) {
		splitFrom = getListByTHtitle($, 'Split from');
	}
	let mergerOf: string | string[] | undefined = getInfoBoxText($, 'Merger of');
	if (mergerOf === undefined) {
		mergerOf = getListByTHtitle($, 'Merger of');
	}
	let precededBy: string | string[] | undefined = getInfoBoxText(
		$,
		'Preceded by'
	);
	if (precededBy === undefined) {
		precededBy = getListByTHtitle($, 'Preceded by');
	}

	// Parse general current info
	const headquarters = getInfoBoxText($, 'Headquarters');
	const youthWing = getInfoBoxText($, 'Youth wing');
	const youthWingURI = getInfoBoxHref($, 'Youth wing');
	const lgbtWing = getInfoBoxText($, 'LGBT wing');
	const numOfMembers = () => {
		let num = getInfoBoxText($, 'Membership');

		if (num === undefined) return undefined;
		let val = extractNumberFromString(num);
		return val;
	};

	const numOfMembersYear = () => {
		let yr = $(`th:contains("Membership")`).text();
		if (yr === undefined) return undefined;

		let year = parseInt(yr.split('(')[1].replace(')', ''));
		return year;
	};

	const website = $(`th:contains("Website")`)
		.parent()
		.next()
		.find('a')
		.attr('href');

	// Parse political position info
	const colours = $('th:contains("Colours")').next('td').find('a').text();
	let ideology: string[] | string | undefined = removeSquareFootnotes(
		$('th:contains("Ideology")').next('td').text().trim()!
	);
	if (hasLowerUpperCasePattern(ideology as string) === true) {
		// Where multiple ideologies are listed, split them into an array
		ideology = splitByLowerUpperCase(ideology as string);
	}
	const politicalPosition = $('a[title="Political spectrum"]')
		.parent()
		.next()
		.text()
		.replace('to', 'to ');
	const europeanParliamentGroup = getInfoBoxText(
		$,
		'European Parliament group'
	);

	// Parse leadership history tables
	let leaderEl = getNextTableElAfterH2text($, 'Leadership');
	if (leaderEl === undefined) {
		leaderEl = getNextTableElAfterH3text($, 'Leadership');
	}
	if (leaderEl === undefined) {
		leaderEl = getNextTableElAfterH4text($, 'Leadership');
	} else if (name === 'Sinn Féin') {
		leaderEl = getNextTableElAfterH2text($, 'Leadership history');
	}
	const partyLeaders = parseTableToObjects(leaderEl?.toString()!);

	let deputyLeaderEl = getNextTableElAfterH3text($, 'Deputy');
	if (deputyLeaderEl === undefined) {
		deputyLeaderEl = getNextTableElAfterH4text($, 'Deputy leader');
	}
	const deputyLeaders = () => {
		if (deputyLeaderEl) {
			return parseTableToObjects(deputyLeaderEl!.toString());
		} else {
			return undefined;
		}
	};

	const seanadLeaderEl = getNextTableElAfterH3text($, 'Seanad leader');
	const seanadLeaders = parseTableToObjects(seanadLeaderEl?.toString()!);

	// Parse election results tables
	let dailResultsEl = getNextTableElAfterH3text($, 'Dáil Éireann');
	if (dailResultsEl === undefined) {
		dailResultsEl = getNextTableElAfterH4text($, 'Dáil Éireann');
	}
	const dailResults: DailElectionData[] = parseDailElectionTable(
		dailResultsEl!.toString()!
	) as DailElectionData[];

	const europeanResultsEl = getNextTableElAfterH3text($, 'European Parliament');
	const europeanResults: ElectionData[] = parseTableToObjects(
		europeanResultsEl?.toString()!
	) as ElectionData[];

	let localResultsEl = getNextTableElAfterH3text($, 'Local elections');
	if (localResultsEl === undefined) {
		localResultsEl = getNextTableElAfterH4text($, 'Local elections');
	}
	const localResults: ElectionData[] = parseTableToObjects(
		localResultsEl?.toString()!
	) as ElectionData[];

	const electionResults = {
		dail: dailResults,
		european: europeanResults,
		local: localResults,
	};

	let partyObject: PartyData = {
		name: name,
		leader: leader!,
		...(deputyLeader && { deputyLeader }),
		...(chairperson && { chairperson }),
		...(viceChairperson && { viceChairperson }),
		...(parliamentaryChairperson && { parliamentaryChairperson }),
		...(generalSecretary && { generalSecretary }),
		...(seanadLeader && { seanadLeader }),
		...(founder && { founder }),
		...(dateFounded && { dateFounded: dateFounded }),
		...(splitFrom && { splitFrom }),
		...(mergerOf && { mergerOf }),
		...(precededBy && { precededBy }),
		...(headquarters && { headquarters }),
		...(youthWing && { youthWing }),
		...(youthWingURI && { youthWingURI }),
		...(lgbtWing && { lgbtWing }),
		...(numOfMembers! && { membership: numOfMembers() }),
		...(numOfMembersYear && { membershipYear: numOfMembersYear() }),
		...(website && { website: website }),
		...(ideology && { ideology: ideology }),
		...(politicalPosition && { politicalPostion: politicalPosition }),
		...(europeanParliamentGroup && {
			europeanParliamentGroup: europeanParliamentGroup,
		}),
		...(partyLeaders && { partyLeaders: partyLeaders }),
		...(deputyLeaders && { deputyLeaders: deputyLeaders() }),
		...(seanadLeaders && { seanadLeaders: seanadLeaders }),
		...(electionResults && { electionResults: electionResults }),
		...(colours && { colours: colours }),
		...(wikiURI && { wikiURI: wikiURI }),
		...(frontBenchWikiURI && { frontBenchWikiURI: frontBenchWikiURI }),
	};

	return formatPartyObject(partyObject);
}
