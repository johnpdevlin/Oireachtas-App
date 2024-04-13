/** @format */

// Importing necessary dependencies and types from Next.js, axios, stream and pdf-parse
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import handleCors from '@/pages/api/middleware/corsMiddleware';

// Handler function that accepts a Next.js API request and response object
export default async function webscrapeHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await handleCors(req, res);

	// Extract the URL from the query parameter
	const url = req.query.url as string;

	try {
		// Set timeout and maximum retries
		const timeout = 10000; // 10 seconds
		const maxRetries = 5;

		// Perform retries
		let retryCount = 0;
		let response;

		while (retryCount < maxRetries)
			try {
				response = await axios.get(url, { timeout });
				break; // Break out of the loop if successful
			} catch (error) {
				console.warn(`Attempt ${retryCount + 1} failed:`, error);
				retryCount++;
			}

		// If all retries fail, throw an error
		if (!response) throw new Error('All retries failed');

		// Send a response with a success message and the parsed text from the PDF file
		res.status(200).json({
			message: 'Webscrape Success',
			text: response.data.toString(),
		});
	} catch (error) {
		// If there is an error, log it to the console and send a response with an error message
		console.error(error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
}
