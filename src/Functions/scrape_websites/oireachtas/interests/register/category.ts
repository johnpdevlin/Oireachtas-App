/** @format */

import { extractAndRemoveTextBetweenParentheses } from '@/functions/_utils/strings';

// Parses individual categories from raw text and returns structured data
export function parseIndividualCategory(
	rawText: string
): { index: number; text: string; additionalInfo: string }[] {
	const { additionalInfo, text } = checkForAdditionalInfoStatement(rawText);
	const rawInterests = splitInterests(text);
	const rawAdditionalInfos = splitInterests(additionalInfo);

	return rawInterests.map((interest) => {
		const foundAdditionalInfo = rawAdditionalInfos.find(
			(info) => info.index === interest.index
		);
		return {
			index: interest.index,
			text: interest.text.trim(),
			additionalInfo: foundAdditionalInfo
				? foundAdditionalInfo.text.trim()
				: '',
		};
	});
}

// Splits the text to separate the main content from the additional information
function checkForAdditionalInfoStatement(text: string): {
	additionalInfo: string;
	text: string;
} {
	const splitText = text.split(/\s*Other Information Provided:\s*/);
	return splitText.length > 1
		? { text: splitText[0].trim(), additionalInfo: splitText[1].trim() }
		: { additionalInfo: '', text: text.trim() };
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
