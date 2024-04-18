/** @format */

import {
	extractDateFromYMDstring,
	formatIncompleteDate,
} from '@/functions/_utils/dates';
import {
	getStringBeforeFirstTargetPoint,
	getTextAfterLastParentheses,
	removeNumbersFromStr,
	getTextAfterLastComma,
} from '@/functions/_utils/strings';
import { extractFirstYear } from '@/functions/_utils/years';
import { removeSquareFootnotes } from '../../_utils/utils';

export type WikiBirthDetails = {
	birthDate: Date | undefined;
	birthPlace: string | undefined;
	birthCountry: string | undefined;
	isIncompleteBirthDate: boolean;
};

export function parseBirthDetails(text: string) {
	const { birthDate, isIncompleteBirthDate } = parseBirthDate(text);

	const birthPlace = parseBirthPlace(text);
	const birthCountry = parseBirthCountry(birthPlace);

	return { birthDate, birthPlace, birthCountry, isIncompleteBirthDate };
}

function parseBirthDate(text: string) {
	let birthDate: Date | undefined =
		(extractDateFromYMDstring(text) as Date) ?? undefined;
	let isIncompleteBirthDate = false;
	isIncompleteBirthDate = true;
	if (!birthDate) {
		if (text.includes('(')) {
			const birthStr = getStringBeforeFirstTargetPoint(text, '(') ?? '';
			birthDate = formatIncompleteDate(birthStr).date;
		}
		if (!birthDate) {
			birthDate = formatIncompleteDate(
				extractFirstYear(text)?.toString() ?? undefined
			).date;
		}
	}
	return { birthDate, isIncompleteBirthDate };
}

function parseBirthPlace(text: string) {
	let birthPlace = removeSquareFootnotes(
		getTextAfterLastParentheses(text)! // extracts the birthplace from the string
	);
	if (!birthPlace) {
		const cleaned = removeNumbersFromStr(text);
		if (cleaned.includes('Ireland')) birthPlace = normalisePlace(cleaned);
	}

	return birthPlace;
}

function parseBirthCountry(birthPlace: string | undefined) {
	if (birthPlace!) {
		if (birthPlace.includes('Ireland')) return 'Ireland';
		else return getTextAfterLastComma(birthPlace) ?? undefined;
	} else return undefined;
}

function normalisePlace(place: string): string {
	// Remove 'c.' and non-alphanumeric characters, then trim extra spaces
	return place
		.replace('c./', '')
		.replace(/[^a-zA-Z0-9\s]/g, '')
		.trim();
}
