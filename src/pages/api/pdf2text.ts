/** @format */

// Importing necessary dependencies and types from Next.js, axios, stream and pdf-parse
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Readable } from 'stream';
import pdf from 'pdf-parse';

// Handler function that accepts a Next.js API request and response object
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Extract the URL from the query parameter
	const url = req.query.url as string;
	try {
		// Make a GET request to the PDF file URL and receive an array buffer in response
		const response = await axios.get(url, { responseType: 'arraybuffer' });
		// Store the array buffer in a variable
		const dataBuffer = response.data;
		// Parse the PDF data into a JSON object
		const pdfData = await pdf(dataBuffer);
		// Log the PDF data to the console
		console.log(pdfData);
		// Create a readable stream from the parsed PDF text
		const stream = Readable.from(pdfData.text);
		// Convert the stream into a buffer and store it in a variable
		const text = await streamToBuffer(stream);
		// Send a response with a success message and the parsed text from the PDF file
		res.status(200).json({
			message: 'PDF file processed successfully',
			text: text.toString(),
		});
	} catch (error) {
		// If there is an error, log it to the console and send a response with an error message
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

// Function that converts a stream to a buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
	// Initialize an empty array to store the buffer chunks
	const chunks: Buffer[] = [];
	// Create a promise that resolves with the concatenated buffer chunks when the stream ends
	return new Promise((resolve, reject) => {
		// Listen for 'data' events from the stream
		stream.on('data', (chunk) => {
			// If the chunk is a string, convert it to a buffer and push it to the chunks array
			if (typeof chunk === 'string') {
				chunks.push(Buffer.from(chunk));
			} else {
				// If the chunk is already a buffer, push it to the chunks array
				chunks.push(chunk);
			}
		});
		// Listen for the 'end' event from the stream
		stream.on('end', () => {
			// Resolve the promise with the concatenated buffer chunks
			resolve(Buffer.concat(chunks));
		});
		// Listen for the 'error' event from the stream
		stream.on('error', (err) => {
			// Reject the promise with the error
			reject(err);
		});
	});
}
