/** @format */

import axios from 'axios';
import * as cheerio from 'cheerio';
import {
	getInfoBoxHref,
	getInfoBoxText,
	getListByTHtitle,
	removeSquareFootnotes,
	getNextTableElAfterH2text,
	getNextTableElAfterH3text,
	getNextTableElAfterH4text,
} from '../_utils/_utils';

import { extractDateFromDmonthYstring } from '@/functions/_utils/dates';
import {
	formatTableArrayToElection,
	parseDailElectionTable,
	parseHTMLtable,
	parseSFhtmlTable,
} from '../_utils/parse_tables/fncParseTables';
import {
	extractNumberFromString,
	splitByLowerUpperCase,
	validateStandardFullName,
} from '@/functions/_utils/strings';
import {
	isArrayOnlyValues,
	removeDuplicateObjects,
} from '@/functions/_utils/arrays';

export type ElectionData = {
	election: number | string;
	country?: string;
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
	ideology: string[];
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
	// Create a new object to hold the formatted data
	const formattedObj: PartyData = Object.fromEntries(
		// Convert the original object to an array of key/value pairs and map over it
		Object.entries(obj).map(([key, value]) => {
			let modifiedValue = value;

			// If the value is a string, format it
			if (typeof value === 'string') {
				// Remove square footnotes from the string
				modifiedValue = removeSquareFootnotes(value.trim())!
					// Remove any backslashes from the string
					.replace(/\\/g, '')
					// Remove any double quotes from the string
					.replace(/"/g, '')
					// Replace any multiple spaces in the string with a single space
					.replace(/\s\s+/g, ' ')
					// Trim the resulting string to remove any extra whitespace
					.trim();
			}

			// If the value is an array and doesn't contain only values, format each object in it
			if (Array.isArray(value) && !isArrayOnlyValues(value)) {
				modifiedValue = value.map((item) =>
					typeof item === 'object' ? formatPartyObject(item) : item
				);
			}

			// Return the formatted key/value pair
			return [key, modifiedValue];
		})
	);

	// Return the formatted object
	return formattedObj;
}

export default async function scrapeWikiPartyPage(
	wikiURI: string
): Promise<PartyData> {
	const url = `https://en.wikipedia.org${wikiURI}`;

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
	if (!founder || validateStandardFullName(founder) === false) {
		founder = getListByTHtitle($, 'Founders');
	}

	let dateFounded = extractDateFromDmonthYstring(getInfoBoxText($, 'Founded')!);
	if (name === 'Sinn Féin') {
		dateFounded = new Date(1970);
		founder = undefined;
	}

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

		if (num === undefined || num === '') return undefined;
		let val = extractNumberFromString(num);
		return val;
	};

	const numOfMembersYear = () => {
		let yr = $(`th:contains("Membership")`).text();

		if (yr === undefined || yr === '') return undefined;

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
	let ideology: string[] | undefined = removeSquareFootnotes(
		$('th:contains("Ideology")').next('td').find('a').text()!
	)?.split('\n');

	if (ideology?.length === 1) {
		ideology = splitByLowerUpperCase(ideology[0]);
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

	let leaderEl: cheerio.Cheerio<cheerio.Element> | undefined = $(
		'#Party_leader'
	)
		.parent()
		.next('table');
	if (leaderEl === undefined || leaderEl.length === 0) {
		leaderEl = getNextTableElAfterH2text($, 'Leadership');
	}

	type Leader = {
		leader: string;
		constituency?: string;
		start: number;
		end?: number;
		notes?: string;
	};

	const partyLeaders = (): Leader[] | undefined => {
		if (leaderEl) {
			const leaders: Leader[] | undefined[] = parseHTMLtable(
				leaderEl.toString()
			).map((obj) => {
				// to format and remove unnecessary properties
				let start: string | undefined, end: string | undefined;

				if (obj.period) {
					[start, end] = obj.period.split('–') as [string, string];
				} else if (obj.dates) {
					[start, end] = obj.dates.split('–') as [string, string];
				} else {
					start = end = undefined; //Initialize in case obj.period and obj.dates are both falsy
				}
				if (name === 'Sinn Féin' && start < 1970) {
					// Sinn Féin's leadership history before 1970 is not relevant to the current party
				} else {
					return {
						leader: obj.leader
							? obj.leader
							: obj.name
							? obj.name
							: obj.president!,
						constituency: obj.constituency || undefined,
						start: start ? parseInt(start) : undefined, //Check if start exists before parseInt
						end: end ? parseInt(end) : undefined, //Check if end exists before parseInt
						notes: obj.notes || undefined, //Changed undefined check to || to handle falsy values correctly
					};
				}
			});
			return leaders.filter((l) => l !== undefined) as Leader[];
		} else {
			return undefined;
		}
	};

	// const deputyLeaderEl = $('#Deputy_leader').parent().next('table');
	// const deputyLeaders = (): Leader[] | undefined => {
	// 	if (deputyLeaderEl) {
	// 		return parseHTMLtable(deputyLeaderEl!.toString()) as Leader[];
	// 	} else {
	// 		return undefined;
	// 	}
	// };

	// const seanadLeaderEl = getNextTableElAfterH3text($, 'Seanad leader');
	// const seanadLeaders = parseHTMLtable(seanadLeaderEl?.toString()!);

	// Parse election results tables
	let dailResultsEl = getNextTableElAfterH3text($, 'Dáil Éireann');
	if (dailResultsEl?.length === 0) {
		dailResultsEl = getNextTableElAfterH4text($, 'Dáil Éireann');
	}

	let dailResults: DailElectionData[] = parseDailElectionTable(
		dailResultsEl!.toString()!
	) as DailElectionData[];

	let europeanResultsEl = getNextTableElAfterH3text($, 'European Parliament');
	if (europeanResultsEl?.length === 0) {
		europeanResultsEl = getNextTableElAfterH3text($, 'European');
	}

	const rawResults = () => {
		if (europeanResultsEl === undefined) return undefined;
		return name === 'Sinn Féin'
			? parseSFhtmlTable(europeanResultsEl!.toString())
			: parseHTMLtable(europeanResultsEl!.toString());
	};

	const europeanResults = (): ElectionData[] | undefined => {
		return rawResults()?.length === 0
			? undefined
			: (formatTableArrayToElection(rawResults() as []) as ElectionData[]);
	};

	let localResultsEl = getNextTableElAfterH3text($, 'Local elections');
	if (localResultsEl?.length === 0) {
		localResultsEl = getNextTableElAfterH4text($, 'Local elections');
	}
	const localResults: ElectionData[] = formatTableArrayToElection(
		parseHTMLtable(localResultsEl?.toString()!) as {}[]
	) as ElectionData[];

	const electionResults = {
		dail: dailResults,
		european: europeanResults()!,
		local: localResults,
	};

	let partyObject: PartyData = {
		name: name,
		leader: leader!,
		...(deputyLeader && { deputyLeader: deputyLeader }),
		...(chairperson && { chairperson: chairperson }),
		...(viceChairperson && { viceChairperson: viceChairperson }),
		...(parliamentaryChairperson && {
			parliamentaryChairperson: parliamentaryChairperson,
		}),
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
		...(numOfMembers && { membership: numOfMembers() }),
		...(numOfMembersYear && { membershipYear: numOfMembersYear() }),
		...(website && { website: website }),
		...(ideology && { ideology: ideology }),
		...(politicalPosition && { politicalPostion: politicalPosition }),
		...(europeanParliamentGroup && {
			europeanParliamentGroup: europeanParliamentGroup,
		}),
		...(partyLeaders && { partyLeaders: partyLeaders() }),
		// ...(deputyLeaders && { deputyLeaders: deputyLeaders() }),
		// ...(seanadLeaders && { seanadLeaders: seanadLeaders }),
		...(electionResults && { electionResults: electionResults }),
		...(colours && { colours: colours }),
		...(wikiURI && { wikiURI: wikiURI }),
		...(frontBenchWikiURI && { frontBenchWikiURI: frontBenchWikiURI }),
	};

	return formatPartyObject(partyObject);
}
