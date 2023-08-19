/** @format */
import axios from 'axios';

interface Member {
	name: string;
	occupations?: string;
	shares?: string;
	directorships?: string;
	property?: string;
	gifts?: string;
	travel?: string;
	benefitsReceived?: string;
	renumeratedPositions?: string;
	contracts?: string;
}

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

function formatInterests(interests: { index: number; text: string }[]) {
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

	const formattedInterests: { [key: string]: string } = {};

	interests.forEach((intr) => {
		const key = searchKeys[intr.index]?.value;
		if (key) {
			formattedInterests[key] = intr.text;
		}
	});

	return formattedInterests;
}

function checkForNextMember(possibleMember: string): boolean {
	// Check for Cormac Devlin (he is the only member with a ` typo in their name)
	if (possibleMember.includes('Cormac`')) {
		return true;
	}
	const regex =
		/^([A-ZÀ-ÖØ-ſ\s\-\']+\,){1}\s*([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-]+)\s*(\(([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-\s]+)\)){0,1}$/;

	return regex.test(possibleMember.trim());
}

export default async function parseInterestsReport(url: string) {
	try {
		const response = await axios.get(`api/pdf2text?url=${url}`);
		const text = response.data.text;

		// Remove lines with page numbers
		const lines = text.split('\n');

		const memberIndexes: {
			name: string;
			startIndex: number;
			endIndex: number;
		}[] = findMemberIndexes(lines);

		const memberInterests = [];
		for (let i = 0; i < memberIndexes.length; i++) {
			const member = memberIndexes[i];
			const memberLines = lines.slice(member.startIndex, member.endIndex);

			const interests = parseLines(memberLines);
			memberInterests.push({ name: member.name, interests });
		}

		const formattedInterests = memberInterests
			.map((member) => {
				const interests = formatInterests(member.interests);
				if (Object.keys(member.interests).length > 0) {
					// check for no interests declared
					return { name: member.name, interests };
				}
			})
			.filter((formattedInterest) => formattedInterest !== undefined);

		return formattedInterests;
	} catch (error) {
		console.log(error);
		throw new Error('Error parsing interests report');
	}
}
