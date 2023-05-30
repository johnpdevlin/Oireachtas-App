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

export default async function parseInterestsReport(
	url: string
): Promise<Member[]> {
	// Array to hold all members and be returned
	let members: Member[] = [];

	axios.get(`api/pdf2text?url=${url}`).then((response) => {
		const text = response.data.text;

		// Split text into lines and remove empty lines
		const lines = text.split('\n').filter((line: string) => line.trim() !== '');

		function checkNothingDeclared(str: string): boolean {
			// check if string contains any of the following
			str = str.toLowerCase().trim();
			if (
				str.includes(
					'nil' ||
						'neamh infheidhme' ||
						'none' ||
						'non-applicable' ||
						'tada' ||
						'i hold no directorships' ||
						'i own no' ||
						'i have no'
				)
			) {
				return true;
			}
			return false;
		}

		function parseLines(
			i: number,
			endClause?: string
		): { parsedLines: string; i: number } {
			let parsedLines = '';
			let tempI: number = i;
			let cutOff = 33; // this is indx in string where '2. Shares ... ' etc ends

			if (endClause!) {
				for (let tempI = i; tempI < lines.length; tempI++) {
					if (!lines[tempI]?.includes(endClause)) {
						parsedLines += lines[tempI];
						tempI++;
					}
				}
			} else {
				console.log('no end clause');
				while (checkForNextMember(lines[tempI]) === false) {
					parsedLines += lines[i];
					tempI++;
				}
			}

			parsedLines = parsedLines.slice(cutOff).replace('.. ', '').trim();
			i = tempI;

			return { parsedLines, i };
		}

		function checkForNextMember(possibleMember: string): boolean {
			const regex =
				/^([A-ZÀ-ÖØ-ſ\s\-\']+\,){1}\s*([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-]+)\s*(\(([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-\s]+)\)){0,1}$/;
			return regex.test(possibleMember.trim());
		}

		let name: string = '';
		let occupations: string | undefined;
		let shares: string | undefined;
		let directorships: string | undefined;
		let property: string | undefined;
		let gifts: string | undefined;
		let travel: string | undefined;
		let benefitsReceived: string | undefined;
		let renumeratedPositions: string | undefined;
		let contracts: string | undefined;
		function resetVariables() {
			name = '';
			occupations = undefined;
			shares = undefined;
			directorships = undefined;
			property = undefined;
			gifts = undefined;
			travel = undefined;
			benefitsReceived = undefined;
			renumeratedPositions = undefined;
			contracts = undefined;
		}

		for (let i = 0; i < lines.length; i++) {
			// let boolean memberFound = false;

			if (checkForNextMember(lines[i].trim())) {
				if (name === '') {
					name = lines[i].split('(')[0].trim();
				} else if (name !== '') {
					const member: Member = {
						name: name,
					};

					occupations! && (member.occupations = occupations);
					shares! && (member.shares = shares);
					directorships! && (member.directorships = directorships);
					property! && (member.property = property);
					gifts! && (member.gifts = gifts);
					travel! && (member.travel = travel);
					benefitsReceived! && (member.benefitsReceived = benefitsReceived);
					renumeratedPositions! &&
						(member.renumeratedPositions = renumeratedPositions);
					contracts! && (member.contracts = contracts);

					members.push(member);
					resetVariables();
				} else if (lines[i].includes('1. Occupations') && occupations === '') {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '2. Shares');
						occupations = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('2. Shares') && shares === '') {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '3. Directorships');
						shares = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('3. Directorships')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '4. Land');
						directorships = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('4. Land')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '5. Gifts');
						property = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('5. Gifts')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '6. Property supplied');
						gifts = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('6. Property supplied')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '7. Travel');
						property = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('7. Travel')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '8. Renumerated Position');
						travel = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('8. Renumerated Position')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i, '9. Contracts');
						renumeratedPositions = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('9. Contracts')) {
					if (!checkNothingDeclared(lines[i])) {
						const temp = parseLines(i);
						contracts = temp.parsedLines;
						i = temp.i;
					}
				} else if (lines[i].includes('Cormac`')) {
					name = lines[i].split('`')[0].trim();
				}
			}
		}
	});
	console.log(members);
	return members;
}
