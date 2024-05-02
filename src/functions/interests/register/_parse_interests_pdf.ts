/** @format */
import { parseMemberSections } from './members';
import { parseIndividualCategory } from './category';
import axios from 'axios';
import he from 'he';
import { parseAndFormatProperties } from './property/_property';
import { parseAndFormatDirectorships } from './directorships/parseAndFormatDirectorships';
import { capitalizeAndAddFullStop } from '../../_utils/strings';
import { RawMemberInterests } from '@/models/member/interests';

const interestKeys: {
	[key: string]: {
		value: string;
		processFunction?: (
			properties: {
				details: string;
				otherInfo?: string;
			}[]
		) => {};
	};
} = {
	'1': { value: 'occupations' },
	'2': { value: 'shares' },
	'3': {
		value: 'directorships',
		// , processFunction: parseAndFormatDirectorships
	},
	'4': {
		value: 'property',
		// , processFunction: parseAndFormatProperties
	},
	'5': { value: 'gifts' },
	'6': { value: 'benefitsReceived' },
	'7': { value: 'travel' },
	'8': { value: 'renumeratedPositions' },
	'9': { value: 'contracts' },
};

export default async function parseInterestsReport(
	url: string
): Promise<RawMemberInterests[]> {
	try {
		const response = await axios.get(`api/pdf2text?url=${url}`);
		const text = he.decode(response.data.text);
		const lines = text.split('\n').filter((l) => l.length > 2 && !Number(l));
		const memberSections = parseMemberSections(lines);

		return memberSections
			.map(({ name, memberLines }) => {
				const interests = parseInterestsLines(memberLines);
				const formattedInterests = formatInterests(interests);

				return { name, ...formattedInterests };
			})
			.filter((member) => Object.keys(member).length > 1); // Filter out members with no interests declared
	} catch (error) {
		console.error('Error parsing interests report:', error);
		throw new Error('Error parsing interests report');
	}
}

function parseInterestsLines(
	lines: string[]
): { index: number; text: string }[] {
	const rawInterests = lines.join('').split(/(?=[1-9]\. )/); // Split by number followed by a dot and a space. E.G. 1. Land etc.

	// Remove empty lines
	const interests = rawInterests.filter((i) => {
		return i !== (' ' && ' ,');
	});

	let num = 0;
	const parsed = interests
		.map((intr) => {
			// Gets number. IE. 1. Land etc.
			let tempNum = parseInt(intr.charAt(0));

			// Avoids category misatribution
			if (tempNum - num === 1) num = tempNum;

			let slicePoint: number = 0;

			for (let i = 0; i < intr.length; i++) {
				if (intr.charAt(i) == num.toString() && intr.charAt(i + 1) === '.') {
					// to skip n. at start of line
					i += 28;
				} else if (
					intr.charAt(i - 1) === '.' &&
					intr.charAt(i) === '.' &&
					intr.charAt(i + 1) === ' '
				) {
					// search for end point of continuous string of ..... (dots)
					slicePoint = i + 2;
					break;
				}
			}

			return { index: num, text: intr.slice(slicePoint!) };
		})
		.filter((i) => checkNothingDeclared(i.text) === false);

	return parsed;
}

function formatInterests(interests: { index: number; text: string }[]) {
	// :  { 	[key: string]: RawInterest[];}

	const formattedInterests: { [key: string]: unknown[] } = {};

	interests.forEach((intr) => {
		const key = interestKeys[intr.index]?.value;

		if (key && intr.text.length > 4) {
			const processFunction = interestKeys[intr.index].processFunction;

			let parsedCategory = parseIndividualCategory(intr.text);

			if (
				parsedCategory[0]?.details.toLowerCase().startsWith(key.toLowerCase())
			)
				// Where key may be included at start of statement i.e. shares:
				parsedCategory = parsedCategory.map((pc) => {
					return {
						details: capitalizeAndAddFullStop(
							pc.details.toLowerCase().replace(`${key}:`, '').trim()
						),
						...(pc.otherInfo && { otherInfo: pc.otherInfo }),
					};
				});

			if (processFunction!) {
				const processedInterests = processFunction(parsedCategory);
				if (processedInterests!) {
					formattedInterests[key] = processedInterests as unknown[];
				}
			} else formattedInterests[key] = parsedCategory;
		}
	});

	return formattedInterests;
}

function checkNothingDeclared(str: string): boolean {
	const searchTerms = [
		'nil',
		'neamh infheidhme',
		'none',
		'non-applicable',
		'tada',
		'i hold no directorships',
		'i own no',
		'i have no',
	];

	str = str.toLowerCase().trim();

	return searchTerms.some(
		(term) =>
			str === term ||
			(str.includes(term) && !str.includes(';') && !str.includes(','))
	);
}
