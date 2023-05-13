/** @format */

interface MemberInterests {
	name: string;
	interests: string[];
}

export default function parseInterestsReport(
	text: string,
	lastNames: string[]
): { [key: string]: string[][] } {
	const interests: { [key: string]: string[][] } = {};

	// Remove unnecessary text from the start and end of the input
	const startIndex = text.indexOf(lastNames[0]);
	const endIndex = text.lastIndexOf(lastNames[lastNames.length - 1]);
	text = text.slice(startIndex, endIndex);

	// Split the text into blocks for each member
	const blocks = text.split(/\n\n \d \n/);

	// Parse each member's interests
	for (const block of blocks) {
		const lines = block.split('\n');
		const lastName = lines[0].split(',')[0].trim();
		if (!lastNames.includes(lastName)) {
			continue;
		}

		const memberInterests: string[][] = [];

		// Find the start of the interests section
		let i = 0;
		while (i < lines.length && !lines[i].startsWith('1. ')) {
			i++;
		}

		// Parse each interest
		while (i < lines.length && !lines[i].startsWith('9. ')) {
			const interest: string[] = [];
			const name = lines[i].slice(3).trim();
			interest.push(name);

			i++;

			while (i < lines.length && /^\(\d+\)/.test(lines[i])) {
				const subInterest = lines[i].slice(lines[i].indexOf('.') + 1).trim();
				interest.push(subInterest);
				i++;
			}

			memberInterests.push(interest);
		}

		interests[lastName] = memberInterests;
	}

	return interests;
}
