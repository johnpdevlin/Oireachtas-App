/** @format */

export default function isValidDate(dateStrings: string | string[]): boolean {
	// Create a regular expression pattern to match the yyyy-mm-dd format
	const pattern = /^\d{4}-\d{2}-\d{2}$/;

	// If the input is a single string, test against the pattern
	if (typeof dateStrings === 'string') {
		return pattern.test(dateStrings);
	}

	// If the input is an array, loop through each element and test against the pattern
	for (const dateString of dateStrings) {
		if (!pattern.test(dateString)) {
			return false;
		}
	}

	// If all dates match the pattern, return true
	return true;
}
