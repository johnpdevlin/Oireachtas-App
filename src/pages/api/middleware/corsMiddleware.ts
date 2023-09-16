/** @format */
import Cors from 'cors';
import { config } from 'dotenv';

import { NextApiRequest, NextApiResponse } from 'next';
import { runMiddleware } from './middleware';

// Load environment variables from .env file
config();

// Define a custom middleware
const cors = Cors({
	origin:
		process.env.NODE_ENV === 'development' // Allow during development
			? '*' // Allow all origins during development
			: process.env.WEB_APP_URL, // Use the URL from .env for production
	methods: ['GET'], // Specify the allowed HTTP methods
});

export default async function handleCors(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await runMiddleware(req, res, cors);
}
