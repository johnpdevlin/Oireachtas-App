/** @format */

export function parseMemberSections(
	lines: string[]
): { name: string; memberLines: string[] }[] {
	// Find indexes of members' sections and parse them
	const memberIndexes = findMemberIndexes(lines);
	return memberIndexes.map(({ name, startIndex, endIndex }) => {
		// Extract lines for each member
		const memberLines = lines.slice(startIndex, endIndex);
		return { name, memberLines };
	});
}

function findMemberIndexes(lines: string[]) {
	const memberIndexes: {
		name: string;
		startIndex: number;
		endIndex: number;
	}[] = [];
	let startIndex = -1;
	let name: string | undefined;

	lines.forEach((line, i) => {
		if (isEndOfDocument(line) && name && startIndex !== -1) {
			// Add member index when end of document is reached
			memberIndexes.push({ name, startIndex, endIndex: i - 1 });
			return;
		}

		if (checkForNextMember(line)) {
			// Add previous member and update for new member
			if (startIndex !== -1 && name) {
				memberIndexes.push({ name, startIndex, endIndex: i - 1 });
			}
			startIndex = i + 1;
			name = extractMemberName(line);
		}
	});

	return memberIndexes;
}

function isEndOfDocument(line: string): boolean {
	// Check if line indicates the end of the document
	return line!.includes('Peter Finnegan');
}

function checkForNextMember(possibleMember: string | undefined): boolean {
	// Check if line indicates a new member section
	if (possibleMember?.includes('Cormac`')) {
		// Handling special case
		return true;
	}
	const regex =
		/^([A-ZÀ-ÖØ-ſ\s\-\']+\,){1}\s*([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-]+)\s*(\(([a-zA-ZÀ-ÖØ-öø-ſ\s\'\-\s]+)\)){0,1}$/;
	return regex.test(possibleMember?.trim() || '');
}

function extractMemberName(line: string | undefined): string {
	// Extract member name from the line
	return line?.split('(').at(0)?.trim() || '';
}
