/** @format */

export function extractFirstYear(text: string): number | undefined {
	// Regular expression to match a four-digit year
	const yearRegex = /\b\d{4}\b/g;

	// Find all matches of four-digit years in the text
	const matches = text.match(yearRegex);

	// If there are matches, return the first one as a number
	if (matches && matches.length > 0) {
		return parseInt(matches[0]);
	}

	// If no matches are found, return undefined
	return undefined;
}
