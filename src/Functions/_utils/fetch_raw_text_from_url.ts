/** @format */

import axios from 'axios';
import he from 'he';

async function fetchRawTextFromUrlWithRetry(
	url: string,
	maxRetries: number = 5
): Promise<string> {
	let retries = 0;
	while (retries < maxRetries) {
		try {
			const response = await axios.get(`api/pdf2text?url=${url}`);
			return he.decode(response.data.text);
		} catch (error) {
			console.log(`Error fetching from URL ${url}, retrying...`);
			retries++;
		}
	}
	throw new Error(
		`Failed to fetch from URL ${url} after ${maxRetries} retries`
	);
}

export { fetchRawTextFromUrlWithRetry };
