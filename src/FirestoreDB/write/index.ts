/** @format */

import axios from 'axios';
import { NextApiResponse } from 'next';
import { ConsoleMessage } from 'puppeteer';

type FirestoreData = {
	[key: string]: any; // Define the structure of your data
};

export const writeObjToFirestore = async (
	collection: string,
	data: FirestoreData,
	id?: string,
	id_field?: string,
	overwrite?: boolean
): Promise<any> => {
	let retryCount = 0;
	const MAX_RETRY_ATTEMPTS = 5;
	const BASE_TIMEOUT_MS = 2000; // Initial timeout in milliseconds

	while (retryCount > MAX_RETRY_ATTEMPTS) {
		try {
			const token = process.env.API_SECRET;

			let url = `/api/firestore?&token=${token}&collection=${collection}&data=${JSON.stringify(
				data
			)}`;

			if (id) url += `&id=${id}`;
			if (id_field) url += `&id_field=${id_field}`;
			if (overwrite) url += `&overwrite=${overwrite}`;

			const response = await axios.post(url);

			return response;
		} catch (error) {
			if (retryCount === 0) {
				// If this was the last retry, throw the error
				console.error(
					'Failed to export data obj to Firestore after ',
					MAX_RETRY_ATTEMPTS,
					' attemps'
				);
				throw error;
			} else {
				// Retry logic
				console.error(
					`Error exporting data to Firestore. Retrying... (${retryCount}/${MAX_RETRY_ATTEMPTS} attempts)`
				);

				if (retryCount < MAX_RETRY_ATTEMPTS) {
					const timeoutMs = BASE_TIMEOUT_MS * Math.pow(2, retryCount);
					console.info(
						`Waiting ${timeoutMs / 1000} seconds before retrying... `
					);
					await new Promise((resolve) => setTimeout(resolve, timeoutMs));
				}
				retryCount++;

				if (error == '431') console.error(data);
			}
		}
	}
};
