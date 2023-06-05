/** @format */

export function startsWithNumber(str: string | undefined): boolean {
	// Check if a string starts with a number
	if (str === undefined) {
		return false;
	}
	return /^\d/.test(str);
}

export function removeFullstopAfterNumber(str: string): string {
	// Remove "1. " or "1." etc. from the"
	return str.replace(/^\d+\.\s*/, '');
}

export function addOrdinalSuffix(num: number): string {
	// Add the correct ordinal suffix to a number
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const mod100 = num % 100;

	// Check for special cases where suffix is "th"
	if (mod100 === 11 || mod100 === 12 || mod100 === 13) {
		return num + 'th';
	}

	// Get the last digit to determine the suffix
	const lastDigit = num % 10;
	const suffix = suffixes[lastDigit] || 'th';

	return num + suffix;
}

export function getTextAfterLastComma(str: string): string {
	// Split the string into an array of substrings based on the comma delimiter
	const parts: string[] = str.split(',');

	// Remove and return the last element of the array
	const lastText: string = parts.pop()?.trim() ?? '';

	return lastText;
}

// Returns text after last parentheses from a string.
export function getTextAfterLastParentheses(input: string): string | undefined {
	// Find the index of the last ")"
	const lastCloseParenIndex = input.lastIndexOf(')');

	// Check if both parentheses are found in the string
	if (lastCloseParenIndex !== -1) {
		// Extract the portion of the string after the last closing parenthesis
		return input.slice(lastCloseParenIndex + 1).trim();
	}

	// Return undefined if parentheses are not found
	return undefined;
}

export function validateStandardName(name: string): boolean {
	// Split the name into individual words
	const words = name.split(' ');

	// Check if each word follows the rules
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (
			i !== 0 &&
			i !== words.length - 1 &&
			(word.toLowerCase() === 'de' || word.toLowerCase() === 'di')
		) {
			continue; // Allow "de" or "di" in the middle of the name
		}
		if (!/^[\p{Lu}\p{Lt}][\p{Ll}\p{Lt}]*$/u.test(word)) {
			return false;
		}
	}

	return true;
}
