/** @format */

import counties from '@/Data/counties';
type ProcessedAddress = {
	line1: string;
	line2?: string;
	line3?: string;
	county: string;
	eirCode: string;
};

export function processAddress(str: string): ProcessedAddress {
	const split = str.split(',');
	let county = '';
	let eirCode = '';
	let line1 = '';
	let line2 = '';
	let line3 = '';
	return {
		line1,
		line2,
		line3,
		county,
		eirCode,
	};
}

export function checkForCountyInAddress(str: string): {
	county: string;
	town?: string;
} {
	str = str.toLowerCase().trim();
	/**
	 * Check for %, at, @
	 * MARK AS EXCEPTION
	 */
	const countiesArray = counties.map((c) => c.toLowerCase());

	// Handle cities or county towns
	let found = countiesArray.find((c) => c === str);
	if (found!) return { county: found, town: found };

	// HANDLE DUBLIN

	if (str.includes('co.')) str.replace('co.', '').trim();
	else if (str.includes('co ')) str.replace('co', '').trim();
	else if (str.includes('county')) str.replace('county', '').trim();

	found = countiesArray.find((c) => c === str);
	if (found!) return { county: found };
	// HANDLE GAEILGE
	else return { county: '' };
}

// Checks if a string contains an Eircode
export function containsEircode(text: string): boolean {
	const eircodeRegex = /[A-Z]{1}\d{2}\s?[A-Z0-9]{4}/;
	return eircodeRegex.test(text);
}

export function extractEircode(text: string): {
	eircode: string | null;
	remainingText: string | null;
} {
	if (!containsEircode(text)) {
		return { eircode: null, remainingText: text };
	}

	const eircodeRegex = /([A-Z]{1}\d{2}\s?[A-Z0-9]{4})/;
	const match = text.match(eircodeRegex);

	if (match) {
		const eircode = match[0];
		const remainingText = text.replace(eircodeRegex, '').trim();

		// Return null for remainingText if it's empty after removing the Eircode
		return {
			eircode,
			remainingText: remainingText !== '' ? remainingText : null,
		};
	}

	return { eircode: null, remainingText: null };
}
