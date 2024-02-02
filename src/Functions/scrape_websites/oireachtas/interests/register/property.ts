/** @format */
import { processAddress } from '@/functions/_utils/address';

/** @format */

export function parseAndFormatProperties(
	properties: {
		text: string;
		otherInfo?: string;
	}[]
) {
	return properties.map((prop) => {
		return processIndividualProperty(
			prop.text,
			prop.otherInfo ? prop.otherInfo : undefined
		);
	});
}

function processIndividualProperty(text: string, otherInfo?: string) {
	if (text.endsWith('.')) text = text.slice(0, text.length - 1);
	if (text.endsWith(',')) text = text.slice(0, text.length - 1);

	const split = text.split(':');
	if (split.length === 2) {
		let [address, description] = split;
		const processedAddress = processAddress(address);
		return {
			...processedAddress,
			otherInfo: otherInfo,
			exception: false,
			description: description,
		};
	} else {
		const processedAddress = processAddress(text);

		if (processedAddress!)
			return {
				...processedAddress,
				otherInfo: otherInfo,
				exception: false,
			};
		return { text: text, address: '', otherInfo: otherInfo, exception: true };
	}
}
