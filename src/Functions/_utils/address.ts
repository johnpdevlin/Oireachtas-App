/** @format */

import { countiesWithIrish } from '@/Data/counties';

type ProcessedAddress = {
	lines: string[];
	town?: string;
	county?: string;
	eirCode?: string;
	dublinCode?: string;
	folio?: string;
	additionalText?: string;
};

export function processAddress(str: string): ProcessedAddress | string {
	let town: string;
	let county: string;
	let eirCode: string;
	let dublinCode: string;
	let additionalText: string;
	let folio: string;

	// Handle exceptional bad formatting
	if (str.includes('at')) [additionalText, str] = str.split('at');
	else if (str.includes('@')) [additionalText, str] = str.split('@');

	const split = str.split(',');
	split
		.map((x) => {
			if (x.includes('%')) {
				additionalText = additionalText ? `${additionalText}, ${x}` : x;
			} else if (x.includes('folio')) {
				x.replace('folio', '')
					.replace('no', '')
					.replace('number', '')
					.replace('#', '')
					.replace('.', '')
					.trim();
				folio = x;
			} else if (containsEircode(x)) {
				const extracted = extractEircode(x);
				eirCode = extracted.eircode!;
				return extracted.remainingText;
			} else return x;
		})
		.filter(Boolean);

	if (split.length < 2) return str;

	// Reverse order to itrate from county etc. upwards
	const reversedArray = split.toReversed();

	let lines: string[] = [];

	// Assign lines, town, county etc.
	reversedArray.map((x) => {
		x.trim();
		if (county === '') {
			const checkCounty = checkForCountyInAddress(x, true);
			if (checkCounty.county!) county = checkCounty.county;
			if (checkCounty.town!) town = checkCounty.town;
			if (checkCounty.dublinCode!) dublinCode = checkCounty.dublinCode;
		} else if (town === '') town = x;
		else {
			lines.push(x);
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
): { county?: string; town?: string; dublinCode?: string } {
	str = str.toLowerCase().trim();

	const countiesArray = countiesWithIrish.map((c) => {
		return {
			english: c.english.toLowerCase(),
			gaeilge: c.gaeilge.toLowerCase(),
		};
	});

	if (checkForTown!) {
		// Handle cities or county towns
		if (str.includes('city')) str.replace('city', '').trim();
		else if (str.includes('cathair na')) str.replace('cathair na', '').trim();

		let found = countiesArray.find(
			(c) => c.english === str || c.gaeilge === str
		);
		if (found!) return { county: found.english, town: found.english };
	}

	if (str.includes('co.')) str.replace('co.', '').trim();
	else if (str.includes('co ')) str.replace('co', '').trim();
	else if (str.includes('county')) str.replace('county', '').trim();
	else if (str.includes('contae')) str.replace('contae', '').trim();

	let found = countiesArray.find((c) => c.english === str || c.gaeilge === str);
	if (found!) return { county: found.english };
	let dublinCity = checkForDublinCity(str);
	if (dublinCity!)
		return { county: 'dublin', town: 'dublin', dublinCode: dublinCity };

	return { town: str };
}

// Deal with Dublin city codes (D1 etc.)
function checkForDublinCity(str: string): string | null {
	str = str.toLowerCase().trim();

	if (str.includes('dublin') || str.includes('d'))
		str = str.replace('dublin', '').replace('d', '').trim();

	if (parseInt(str))
		if (str.includes('6w') || str.includes('06w')) return '6w';
		else return parseInt(str).toString();

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
