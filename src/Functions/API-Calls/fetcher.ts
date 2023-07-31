/** @format */

import axios from 'axios';

/**
 * Makes a GET request to the specified URL using axios and returns the response data.
 * If the request fails, logs the error to the console.
 * @param url The URL to request
 * @returns A Promise that resolves to the response data or rejects with an error
 */
export default async function fetcher(url: string): Promise<any> {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
	}
}
