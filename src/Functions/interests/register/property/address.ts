/** @format */

import { countiesWithIrish } from '@/Data/counties';
import similarity from 'string-similarity';

export type ProcessedAddress = {
	lines: string[];
	town?: string;
	county?: string;
	eirCode?: string;
	dublinCode?: string;
	folio?: string;
	additionalText?: string;
};

export function processAddress(str: string): ProcessedAddress | null {
	let town: string;
	let county: string;
	let eirCode: string;
	let dublinCode: string;
	let additionalText: string;
	let folio: string;

	str = str.toLowerCase().trim();

	// Handle exceptional bad formatting
	if (str.includes(' at ')) {
		[additionalText, str] = str.split(' at ');
	} else if (str.includes('@')) {
		[additionalText, str] = str.split('@');
	}

	const split = str.toLowerCase().split(',');
	if (split.filter((s) => s.includes('co.')).length > 1) return null;

	// Extract Eircode and deal with other exceptional formatting
	// Process each part for eirCode, folio, or additional text
	const cleanedSplit = split
		.map((part) => {
			if (part.includes('%')) {
				additionalText += additionalText ? `, ${part}` : part;
				return;
			} else if (part.includes('folio')) {
				folio = part.replace(/folio|no|number|#|\./gi, '').trim();
				return;
			} else if (containsEircode(part)) {
				const { eircode, remainingText } = extractEircode(part);
				if (eircode) eirCode = eircode;
				if (remainingText) return remainingText;
				return;
			}
			return part;
		})
		.filter(Boolean);

	if (cleanedSplit.length < 2) return null;

	// Reverse order to itrate from county etc. upwards
	const reversedArray = cleanedSplit.toReversed();

	let lines: string[] = [];

	// Assign lines, town, county etc.
	reversedArray.forEach((x) => {
		if (x!) {
			const checkCounty = checkForCountyInAddress(x, true);
			if (!county && checkCounty.county) {
				if (checkCounty.county) county = checkCounty.county.trim();
				if (checkCounty.town) town = checkCounty.town.trim();
				if (checkCounty.dublinCode) dublinCode = checkCounty.dublinCode.trim();
				if (checkCounty.additionalText)
					additionalText += additionalText
						? `, ${checkCounty.additionalText}`
						: checkCounty.additionalText;
			} else if (!town) {
				town = x.trim();
			} else {
				lines.push(x.trim());
			}
		}
	});

	// Reverse order
	lines.reverse();

	return {
		lines: lines,
		...(town! && { town: town }),
		...(county! && { county: county }),
		...(dublinCode! && { dublinCode: dublinCode }),
		...(eirCode! && { eirCode: eirCode }),
		...(folio! && { folio: folio }),
		...(additionalText! && { additionalText: additionalText }),
	};
}

// Cross references for county and checks for county towns / cities e.g. Cork City
export function checkForCountyInAddress(
	str: string,
	checkForTown: boolean
): {
	county?: string;
	town?: string;
	dublinCode?: string;
	additionalText?: string;
} {
	str = str.trim();

	const countiesArray = countiesWithIrish.map((c) => {
		return {
			english: c.english.toLowerCase(),
			gaeilge: c.gaeilge.toLowerCase(),
		};
	});

	if (
		str.includes('private') ||
		str.includes('office') ||
		str.includes('house') ||
		str.includes('constituency')
	)
		return { additionalText: str };

	// Handle cities or county towns
	{
		if (str.includes('city')) str = str.replace('city', '').trim();
		else if (str.includes('cathair na'))
			str = str.replace('cathair na', '').trim();

		let found = countiesArray.find(
			(c) => c.english === str || c.gaeilge === str
		);
		if (found!) return { county: found.english, town: found.english };

		if (str.includes('co.')) str = str.replace('co.', '').trim();
		else if (str.includes('co ')) str = str.replace('co', '').trim();
		else if (str.includes('county')) str = str.replace('county', '').trim();
		else if (str.includes('contae')) str = str.replace('contae', '').trim();
	}

	// Check for Dublin
	let dublinCity = checkForDublinCity(str);
	if (dublinCity!) {
		return { county: 'dublin', town: 'dublin', dublinCode: dublinCity };
	}

	let found = countiesArray.find((c) => c.english === str || c.gaeilge === str);
	if (found!) return { county: found.english };
	else {
		const gaeilgeCounties = countiesArray.map((c) => c.gaeilge);
		const bestMatch = similarity.findBestMatch(str, gaeilgeCounties);
		if (bestMatch.bestMatch.rating > 0.6) {
			const county = countiesArray.find(
				(c) => c.gaeilge === bestMatch.bestMatch.target
			);
			return { county: county?.english };
		}
	}

	return { town: str };
}

// Deal with Dublin city codes (D1 etc.)
function checkForDublinCity(str: string): string | null {
	str = str.toLowerCase().trim();

	if (str.includes('dublin') || str.includes('d')) {
		str = str.replace('dublin', '').replace('d', '').trim();
		if (parseInt(str))
			if (str.includes('6w') || str.includes('06w')) return '6w';
			else return parseInt(str).toString();
	}
	return null;
}

// Checks if a string contains an Eircode
export function containsEircode(text: string): boolean {
	const eircodeRegex = /[A-Z]{1}\d{2}\s?[A-Z0-9]{4}/;
	return eircodeRegex.test(text);
}

// Extract eircode and any remaining text
export function extractEircode(text: string): {
	eircode: string | null;
	remainingText: string | null;
} {
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
