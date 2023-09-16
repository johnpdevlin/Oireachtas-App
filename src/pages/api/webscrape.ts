/** @format */

// Importing necessary dependencies and types from Next.js, axios, stream and pdf-parse
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import handleCors from '@/pages/api/middleware/corsMiddleware';

// Handler function that accepts a Next.js API request and response object
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await handleCors(req, res);

	// Extract the URL from the query parameter
	const url = req.query.url as string;
	try {
		// Get the raw html
		const response = await axios.get(url);

		// Send a response with a success message and the parsed text from the PDF file
		res.status(200).json({
			message: 'Webscrape Success',
			text: response.data.toString(),
		});
	} catch (error) {
		// If there is an error, log it to the console and send a response with an error message
		console.warn(error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
}
