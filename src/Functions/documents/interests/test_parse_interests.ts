/** @format */
import { getStringBeforeFirstTargetPoint } from '@/functions/_utils/strings';
import axios from 'axios';
import { removeTextBeforeClosingParenthesis } from '../../_utils/strings';

type RawMemberInterests = {
	name: string;
	occupations?: RawInterest[];
	shares?: RawInterest[];
	directorships?: RawInterest[];
	property?: RawInterest[];
	gifts?: RawInterest[];
	travel?: RawInterest[];
	benefitsReceived?: RawInterest[];
	renumeratedPositions?: RawInterest[];
	contracts?: RawInterest[];
};

type RawInterest = {
	info: string;
	additionalInfo1: string;
	additionalInfo2: string;
	genericInfo: string;
};

function findMemberIndexes(lines: string[]) {
	const memberIndexes: {
		name: string;
		startIndex: number;
		endIndex: number;
	}[] = [];

	let startIndex = -1; // Initialize startIndex as -1 to indicate it's not set
	let name: string | undefined = undefined;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (
			line.includes('Peter Finnegan') &&
			name !== undefined &&
			startIndex !== -1
		) {
			// If the line contains 'Peter Finnegan' (appears at bottom of PDF) and name and startIndex are set, add the member index
			const endIndex = i - 1;
			memberIndexes.push({ name, startIndex, endIndex });
			break; // Exit the loop since the target member index is found
		}

		if (checkForNextMember(line)) {
			// If the line indicates the start of a new member
			if (startIndex !== -1 && name !== undefined) {
				// If startIndex is set, add the previous member index
				const endIndex = i - 1;
				memberIndexes.push({ name, startIndex, endIndex });
			}

			// Set the new member's name and startIndex
			startIndex = i + 1;
			name = line.split('(')[0].trim();
		}
	}

	return memberIndexes;
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

	return searchTerms.some((term) => str.includes(term));
}

function parseLines(lines: string[]): { index: number; text: string }[] {
	const rawInterests = lines.join().split(/(?=\d\. )/); // Split by number followed by a dot and a space. E.G. 1. Land etc.

	// Remove empty lines
	const interests = rawInterests.filter((i) => {
		return i !== (' ' && ' ,');
	});

	const parsed = interests
		.map((intr) => {
			const num: number = parseInt(intr.charAt(0)); // Gets number. IE. 1. Land etc.
			let slicePoint: number = 0;

			for (let i = 0; i < intr.length; i++) {
				if (intr.charAt(i) == num.toString() && intr.charAt(i + 1) === '.') {
					// to skip n. at start of line
					i += 28;
				} else if (intr.charAt(i) === '.' && intr.charAt(i + 1) === ' ') {
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

function processInterestText(
	interestText: string,
	genericInfo: string,
	additionalInfo: string[]
): RawInterest[] {
	return interestText
		.split(';')
		.filter((item) => item.trim() !== '') // Filter out empty items
		.map((item) => {
			const trimmed = item.trim();
			const splitItems = trimmed.split(':');
			const info = splitItems.length > 0 ? splitItems[0] : '';
			const additionalInfo1 = splitItems.length > 1 ? splitItems[1] : '';
			const numMatch = trimmed.match(/\((\d+)\)/);
			const num = numMatch ? parseInt(numMatch[1], 10) : null;

			return {
				info: removeTextBeforeClosingParenthesis(info.trim()),
				additionalInfo1: additionalInfo1.trim(),
				additionalInfo2:
					num && additionalInfo[num - 1] ? additionalInfo[num - 1].trim() : '',
				genericInfo: genericInfo,
			};
		});
}

function formatInterests(interests: { index: number; text: string }[]): {
	[key: string]: RawInterest[];
} {
	const searchKeys: { [key: string]: { value: string } } = {
		'1': { value: 'occupations' },
		'2': { value: 'shares' },
		'3': { value: 'directorships' },
		'4': { value: 'property' },
		'5': { value: 'gifts' },
		'6': { value: 'travel' },
		'7': { value: 'benefitsReceived' },
		'8': { value: 'renumeratedPositions' },
		'9': { value: 'contracts' },
	};

	const formattedInterests: { [key: string]: RawInterest[] } = {};

	interests.forEach((intr) => {
		const key = searchKeys[intr.index]?.value;
		if (key) {
			const splitText = intr.text.split('Other Information Provided:');
			let interestText = splitText.length > 0 ? splitText[0] : '';
			let rawAdditionalInfo = splitText.length > 1 ? splitText[1] : '';
			let genericInfo = '';
			let additionalInfo: string[] = [];

			if (interestText.includes('(') && interestText.includes(')')) {
				const genericMatch = interestText.match(/^([^(]+)\(\d+\)/);
				if (genericMatch) {
					genericInfo = getStringBeforeFirstTargetPoint(
						genericMatch[1],
						'('
					).trim();
				}

				additionalInfo = rawAdditionalInfo
					.split(';')
					.map((info) => info.trim())
					.filter((info) => info !== ''); // Filter out empty items
			}

			const processedInterests = processInterestText(
				interestText,
				genericInfo,
				additionalInfo
			);

			if (!formattedInterests[key]) {
				formattedInterests[key] = [];
			}
			formattedInterests[key].push(...processedInterests);
		}
	});

	console.log(formattedInterests);
	return formattedInterests;
}

// function checkForNextMember(possibleMember: string): boolean {
// 	// Check for Cormac Devlin (he is the only member with a ` typo in their name)
// 	if (possibleMember.includes('Cormac`')) {
// 		return true;
// 	}
// 	const regex =
// 		/^([A-ZÀ-ÖØ-ſ\s\-\']+\,){1}\s*([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-]+)\s*(\(([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-\s]+)\)){0,1}$/;

// 	return regex.test(possibleMember.trim());
// }
// export default async function parseInterestsReport(
// 	url: string
// ): Promise<RawMemberInterests[]> {
// 	try {
// 		const response = await axios.get(`api/pdf2text?url=${url}`);
// 		const text = response.data.text;
// 		const lines = text.split('\n');
// 		const memberIndexes = findMemberIndexes(lines);

// 		return memberIndexes
// 			.map(({ name, startIndex, endIndex }) => {
// 				const memberLines = lines.slice(startIndex, endIndex);
// 				const interests = parseLines(memberLines);
// 				const formattedInterests = formatInterests(interests);

// 				return { name, ...formattedInterests };
// 			})
// 			.filter((member) => Object.keys(member).length > 1); // Filter out members with no interests declared
// 	} catch (error) {
// 		console.error('Error parsing interests report:', error);
// 		throw new Error('Error parsing interests report');
// 	}
// }
/**
 * Check for additional info
 *  Check for (1)
 * Check for previous text before (1) only
 * SPLIT by (1) etc.
 * Check for trailing text before (1)
 * Check for : and split, assign type (CREATE TYPES)
 * Check for (text) and after (text)
 */

/**
 * WORD / SYMBOLS
 * - @ - place
 *  at - check for info before
 * - check for capitalization mid line etc.
 * - : - dilineates info
 * - constituency office
 * - rent / lessor
 * - House as start
 * - Hectares, acres
 * - fodder, agriculture
 * - folio
 * - in
 * - OTHER INFO PROVIDED
 * 	- Check for duplicate phrases - '2 bed cottage (rented)' -occurs Carol Nolan (2022)
 *
 */

/**
 * SUPPLIED
 * - 'or a Service supplied' remove from line
 *  */
