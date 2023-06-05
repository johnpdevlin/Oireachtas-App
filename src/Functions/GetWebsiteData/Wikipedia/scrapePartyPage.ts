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
import { validateStandardName } from '@/Functions/Util/strings';
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
	anthem?: string;
	slogan?: string;
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
	const formattedObj: PartyData = Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			let modifiedValue = value;
			if (typeof value === 'string') {
				modifiedValue = removeSquareFootnotes(value.trim());
			}
			if (Array.isArray(value)) {
				if (isArrayOnlyValues(value) === false) {
					modifiedValue = removeDuplicateObjects(value as {}[]);
				}
			}
			// Return the modified key-value pair as an array
			return [key, modifiedValue];
		})
	);

	return formattedObj;
}

export default async function scrapeWikiPartyPage(
	wikiURI: string
): Promise<PartyData> {
	const url = `https://en.wikipedia.org${wikiURI}`;

	// aontu local elections (NI issue)
	// sf dail elections, ideology, membership
	// fg merger of
	// labor iedology
	// remove "/" "/n" replace with " ", replace "  " with " " and then trim
	// format object keys
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
	const splitFrom = getInfoBoxTitle($, 'Split');
	const mergerOf = getInfoBoxTitle($, 'Merger of');
	const precededBy = getListByTHtitle($, 'Preceded by');

	// Parse general current info
	const headquarters = getInfoBoxText($, 'Headquarters');
	const youthWing = getInfoBoxText($, 'Youth wing');
	const youthWingURI = getInfoBoxHref($, 'Youth wing');
	const lgbtWing = getInfoBoxText($, 'LGBT wing');
	const numOfMembers = () => {
		let num = getInfoBoxText($, 'Membership');

		if (num === undefined) return undefined;
		let val = parseInt(num.replace(',', '').trim());
		return val;
	};

	const numOfMembersYear = () => {
		let yr = $(`th:contains("Membership")`).text();
		if (yr === undefined) return undefined;

		let year = parseInt(yr.split('(')[1].replace(')', ''));
		return year;
	};
	const anthem = getInfoBoxText($, 'Anthem')
		?.trim()!
		.replaceAll(/\\/g, '')
		.replaceAll('"', '');
	const website = $(`th:contains("Website")`)
		.parent()
		.next()
		.find('a')
		.attr('href');

	// Parse political position info
	const slogan = removeSquareFootnotes(getInfoBoxText($, 'Slogan')!);
	const colours = $('th:contains("Colours")').next('td').find('a').text();
	const ideology = getListByTHtitle($, 'Ideology')
		? getListByTHtitle($, 'Ideology')
		: getInfoBoxText($, 'Ideology');
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
	} else if (name === 'Sinn Féin') {
		leaderEl = getNextTableElAfterH2text($, 'Leadership history');
	}
	const partyLeaders = parseTableToObjects(leaderEl?.toString()!);

	let deputyLeaderEl = getNextTableElAfterH3text($, 'Deputy');
	if (deputyLeaderEl === undefined) {
		deputyLeaderEl = getNextTableElAfterH4text($, 'Deputy Leader');
	}
	const deputyLeaders = parseTableToObjects(deputyLeaderEl?.toString()!);
	const seanadLeaderEl = getNextTableElAfterH3text($, 'Seanad leader');
	const seanadLeaders = parseTableToObjects(seanadLeaderEl?.toString()!);

	// Parse election results tables
	const dailResultsEl = getNextTableElAfterH3text($, 'Dáil Éireann');
	const dailResults: DailElectionData[] = parseDailElectionTable(
		dailResultsEl!.toString()!
	) as DailElectionData[];

	const europeanResultsEl = getNextTableElAfterH3text($, 'European Parliament');
	const europeanResults: ElectionData[] = parseTableToObjects(
		europeanResultsEl?.toString()!
	) as ElectionData[];

	const localResultsEl = getNextTableElAfterH3text($, 'Local elections');
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
		...(anthem && { anthem }),
		...(website && { website }),
		...(slogan && { slogan }),
		...(ideology && { ideology }),
		...(politicalPosition && { politicalPosition }),
		...(europeanParliamentGroup && { europeanParliamentGroup }),
		...(partyLeaders && { partyLeaders }),
		...(deputyLeaders && { deputyLeaders }),
		...(seanadLeaders && { seanadLeaders }),
		...(electionResults && { electionResults }),
		...(colours && { colours: colours }),
		...(wikiURI && { wikiURI: wikiURI }),
		...(frontBenchWikiURI && { frontBenchWikiURI: frontBenchWikiURI }),
	};

	return formatPartyObject(partyObject);
}
