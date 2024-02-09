/** @format */

import { extractAndRemoveTextBetweenParentheses } from '@/functions/_utils/strings';

// Parses individual categories from raw text and returns structured data
export function parseIndividualCategory(
	rawText: string
): { text: string; otherInfo: string }[] {
	const { otherInfo, text } = checkForOtherInfoStatement(rawText);
	const rawInterests = splitInterests(text);
	const rawOtherInfo = splitInterests(otherInfo);

	return rawInterests.map((interest) => {
		const foundotherInfo = rawOtherInfo.find(
			(info) => info.index === interest.index
		);
		return {
			text: interest.text.trim(),
			otherInfo: foundotherInfo ? foundotherInfo.text.trim() : '',
		};
	});
}

// Splits the text to separate the main content from the additional information
function checkForOtherInfoStatement(text: string): {
	otherInfo: string;
	text: string;
} {
	const splitText = text.split(/\s*Other Information Provided:\s*/);
	return splitText.length > 1
		? { text: splitText[0].trim(), otherInfo: splitText[1].trim() }
		: { otherInfo: '', text: text.trim() };
}

// Splits interests from a text block and structures them
function splitInterests(text: string): { index: number; text: string }[] {
	if (!text.includes(';')) return [{ index: 0, text: text }];
	return text
		.split(';')
		.filter((item) => item.trim() !== '')
		.map((item) => {
			const extracted = extractAndRemoveTextBetweenParentheses(item);
			return {
				index: parseInt(extracted.extracted),
				text: extracted.text,
			};
		});
}
