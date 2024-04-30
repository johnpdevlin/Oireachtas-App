/** @format */

import {
	capitaliseFirstLetters,
	getStringAfterFirstTargetPoint,
} from '@/functions/_utils/strings';
import { DebateRecord } from '@/models/oireachtas_api/debate';
import { CommitteeDebateRecord } from '@/models/oireachtas_api/debate';

export default function formatCommitteeDebates(
	debates: DebateRecord[]
): CommitteeDebateRecord[] {
	const formatted = debates.reduce(
		(results: CommitteeDebateRecord[], deb: DebateRecord) => {
			const date = new Date(deb.date);
			const dateStr = deb.date;
			const rootName = capitaliseFirstLetters(
				extractRootCommitteeDetails(deb.house.showAs.toLowerCase())
			);
			const name = deb.house.showAs.toLowerCase();
			const pdf = deb.formats.pdf?.uri;
			if (!pdf) {
				console.warn(
					`No PDF file found for ${name} debate on ${dateStr} \n ${deb}`
				);
			} else {
				const rootURI = extractRootCommitteeDetails(deb.house.committeeCode!);
				const uri = deb.house.uri;

				const type = extractCommitteeType(deb.house.showAs.toLowerCase());
				const houseNo = parseInt(deb.house.houseNo);
				const chamber = deb.house.houseCode;
				const xml = deb.formats.xml?.uri;
				const committeeCode = deb.house.committeeCode!;

				results.push({
					committeeCode,
					date,
					dateStr,
					rootName,
					name,
					type,
					chamber,
					houseNo,
					rootURI,
					uri,
					pdf,
					xml,
				});
			}
			return results; // Return the updated results array in each iteration
		},
		[] // Provide an empty array as the initial value
	);
	return formatted;
}

function extractRootCommitteeDetails(str: string): string {
	let rootCommittee = '';
	if (
		str.startsWith('joint') ||
		str.startsWith('standing') ||
		str.startsWith('select')
	) {
		if (str.includes('_'))
			rootCommittee = getStringAfterFirstTargetPoint(str, '_');
		else if (str.includes(' '))
			rootCommittee = getStringAfterFirstTargetPoint(str, ' ');
	} else if (str.includes('choiste') || str.includes('coiste')) {
		let committee = '';
		if (str.includes('meáin')) {
			committee =
				'Committee on Media, Tourism, Arts, Culture, Sport and the Gaeltacht';
		} else {
			committee =
				'Committee on the Irish Language, Gaeltacht and the Irish-speaking Community';
			if (str.includes('_'))
				committee = committee.replace('Committee on the ', '');
		}

		if (str.includes('_')) committee = committee.replaceAll(' ', '-');
		rootCommittee = committee;
	}
	if (rootCommittee === '') rootCommittee = str;
	if (str.includes('_')) {
		rootCommittee = rootCommittee
			.toLowerCase()
			.replaceAll(',', '')
			.replaceAll('_', '-');
		if (
			!rootCommittee.includes('standing') &&
			!rootCommittee.startsWith('committee-on-the') &&
			rootCommittee.startsWith('committee-on-')
		)
			rootCommittee = rootCommittee.replace('committee-on-', '');
	}
	return rootCommittee;
}

function extractCommitteeType(uri: string): string {
	if (
		uri.startsWith('joint') ||
		uri.startsWith('comh') ||
		uri.includes('public_petitions')
	) {
		return 'joint';
	} else if (uri.startsWith('standing')) {
		return 'standing';
	} else if (uri.startsWith('working') && uri.includes('group')) {
		return 'working group';
	}
	return 'select';
}
