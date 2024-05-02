/** @format */
import { capitalizeAndAddFullStop } from '../../_utils/strings';

// Parses individual categories from raw text and returns structured data
export function parseIndividualCategory(
	rawText: string
): { details: string; otherInfo?: string }[] {
	const { otherInfo, text } = checkForOtherInfoStatement(rawText);
	const rawInterests = splitInterests(text!)!;
	const rawOtherInfo = splitInterests(otherInfo);

	return rawInterests.map((interest) => {
		const foundOtherInfo = rawOtherInfo?.find(
			(info) => info.index === interest.index
		);

		return {
			details: capitalizeAndAddFullStop(interest.text),
			...(foundOtherInfo?.text && {
				otherInfo: capitalizeAndAddFullStop(foundOtherInfo?.text),
			}),
		};
	});
}

// Splits the text to separate the main content from the additional information
function checkForOtherInfoStatement(text: string): {
	text: string;
	otherInfo: string | undefined;
} {
	const splitText = text.split(/\s*Other Information Provided:\s*/);
	return splitText.length > 1
		? {
				text: splitText[0],
				otherInfo: splitText[1],
		  }
		: { otherInfo: undefined, text: text };
}

function splitInterests(
	text: string | undefined
): { index: number; text: string }[] | undefined {
	if (!text) return undefined;

	// Regular expression to match "(n)" where n is a number between 1 and 200
	const regex = /\((1?\d{1,2}|200)\)/g;

	let split = text
		.split(regex)
		.filter((item) => item.trim() !== '' && !Number(item))
		.map((item) => {
			// Extract the index and text from each item
			const index = text.indexOf(item);
			return { index, text: item };
		})
		.filter((item) => item.text.length > 5); // Filter out items with length less than 5

	// Check if the first item ends with a colon
	if (split.length > 0 && split[0].text.trim().endsWith(':')) {
		const firstWord = split[0].text;
		// Filter out the first item and concatenate its text with the remaining items
		split = split.slice(1).map((item) => ({
			index: item.index,
			text: `${firstWord}${item.text}`,
		}));
	}

	return split;
}
