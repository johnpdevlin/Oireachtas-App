/** @format */

// Importing necessary dependencies and types from Next.js, fs, and path
import fs from 'fs';
import { join } from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import handleCors from '@/pages/api/middleware/corsMiddleware';

// Handler function that accepts a Next.js API request and response object
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await handleCors(req, res);

	if (req.method === 'POST') {
		const { data, filename, directory } = req.body;

		if (!data || !filename) {
			return res.status(400).json({ error: 'Data and filename are required' });
		}

		let filePath = join(process.cwd(), 'src/Data', filename);

		if (directory) {
			const directoryPath = join(process.cwd(), 'Data', directory);
			fs.mkdirSync(directoryPath, { recursive: true });
			filePath = join(directoryPath, filename);
		}

		try {
			// Set timeout and maximum retries
			const timeout = 10000; // 10 seconds
			const maxRetries = 3;

			// Perform retries
			let retryCount = 0;

			while (retryCount < maxRetries) {
				try {
					const objectJson = JSON.stringify(data, null, 2);
					fs.writeFileSync(filePath, objectJson, 'utf-8');
					res.status(200).json({ message: 'Object saved to file' });
					break; // Break out of the loop if successful
				} catch (error) {
					console.warn(`Attempt ${retryCount + 1} failed:`, error);
					retryCount++;
				}
			}

			// If all retries fail, throw an error
			if (retryCount === maxRetries) {
				throw new Error('All retries failed');
			}
		} catch (error) {
			console.error('Error saving object to file:', error);
			res.status(500).json({ error: 'Error saving object to file' });
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
