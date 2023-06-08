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

export function validateStandardFullName(name: string): boolean {
	// If the name consists of only one word, return false
	if (name.split(' ').length === 1) {
		return false;
	}
	// Split the name into individual words
	const words = name.split(' ');
	// Check if each word follows the rules
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		// Allow "de" or "di" in the middle of the name
		if (
			i !== 0 &&
			i !== words.length - 1 &&
			(word.toLowerCase() === 'de' || word.toLowerCase() === 'di')
		) {
			continue;
		}
		// Check if the word starts with an upper- or titlecase letter, followed by zero or more letters (including periods)
		if (!/^[\p{Lu}\p{Lt}][\p{L}\.]*$/u.test(word)) {
			return false;
		}
		// Check if the word ends with a dot followed by zero or more uppercase or titlecase letters
		if (
			/^\p{Lu}\.$/u.test(word) &&
			(!/^[\p{L}\.]*$/u.test(words[i + 1]) || words[i + 1] === undefined)
		) {
			return false;
		}
	}
	return true;
}

export function extractNumberFromString(input: string): number {
	const regex = /[\d,]+/g;
	const matches = input.match(regex);

	if (!matches) {
		return NaN; // Return NaN if no matches are found
	}

	let longestNumberString = '';

	for (const match of matches) {
		if (match.length > longestNumberString.length) {
			longestNumberString = match;
		}
	}

	// Remove commas and convert the longest number string to a number
	const numberValue = parseFloat(longestNumberString.replace(/,/g, ''));

	return isNaN(numberValue) ? NaN : numberValue; // Return NaN if the conversion fails
}

export function splitByLowerUpperCase(input: string): string[] {
	const result: string[] = [];
	let startIndex = 0;

	for (let i = 1; i < input.length; i++) {
		const currentChar = input[i];
		const previousChar = input[i - 1];

		// Check if a lowercase letter precedes an uppercase letter
		if (/[a-z]/.test(previousChar) && /[A-Z]/.test(currentChar)) {
			result.push(input.substring(startIndex, i).trim());
			startIndex = i;
		}
	}

	// Add the last substring
	result.push(input.substring(startIndex).trim());

	return result;
}
export function hasLowerUpperCasePattern(input: string): boolean {
	const regex = /(?=[A-Z][a-z])/; // Lookahead assertion to match the pattern

	return regex.test(input);
}

export function concatenateItems(items: String[]): string {
	const numItems = items.length;

	// Case when there are only two items
	if (numItems === 2) {
		return `${items[0]} & ${items[1]}`;
	}

	// Case when there are more than two items
	if (numItems > 2) {
		const lastIndex = numItems - 1;
		const lastItem = items[lastIndex];
		const otherItems = items.slice(0, lastIndex);

		// Join all items except the last one with ", "
		const concatenatedOtherItems = otherItems.join(', ');

		// Concatenate the last item with ", and "
		return `${concatenatedOtherItems}, and ${lastItem}`;
	}

	// Case when there are no items
	return '';
}
