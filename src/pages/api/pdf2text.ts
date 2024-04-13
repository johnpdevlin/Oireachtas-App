/** @format */

// Importing necessary dependencies and types from Next.js, axios, stream and pdf-parse
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Readable } from 'stream';
import pdf from 'pdf-parse';
import handleCors from '@/pages/api/middleware/corsMiddleware';

// Handler function that accepts a Next.js API request and response object
export default async function PDF2TextHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await handleCors(req, res);

	const url = req.query.url as string;
	try {
		// Set timeout and maximum retries
		const timeout = 10000; // 10 seconds
		const maxRetries = 5;

		// Perform retries
		let retryCount = 0;
		let pdfData;

		while (retryCount < maxRetries) {
			try {
				const response = await axios.get(url, {
					responseType: 'arraybuffer',
					timeout,
				});
				const dataBuffer = response.data;
				pdfData = await pdf(dataBuffer);
				break; // Break out of the loop if successful
			} catch (error) {
				console.warn(`Attempt ${retryCount + 1} failed:`, error);
				retryCount++;
			}
		}

		// If all retries fail, throw an error
		if (!pdfData) throw new Error('All retries failed');

		const stream = Readable.from(encodeText(pdfData.text));
		const text = await streamToBuffer(stream);

		res.status(200).json({
			message: 'PDF file processed successfully',
			text: text.toString(),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => {
			if (typeof chunk === 'string') chunks.push(Buffer.from(chunk));
			else chunks.push(chunk);
		});

		stream.on('end', () => resolve(Buffer.concat(chunks)));

		stream.on('error', (err) => reject(err));
	});
}

function encodeText(text: string): string {
	const encodedText = text.replace(
		/[\u0080-\uFFFF]/g,
		(match) => `&#${match.charCodeAt(0)};`
	);
	return encodedText;
}
