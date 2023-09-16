/** @format */

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Readable } from 'stream';
import pdf from 'pdf-parse';
import handleCors from '@/pages/api/middleware/corsMiddleware';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await handleCors(req, res);

	const url = req.query.url as string;
	try {
		const response = await axios.get(url, { responseType: 'arraybuffer' });
		const dataBuffer = response.data;
		const pdfData = await pdf(dataBuffer);

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
			if (typeof chunk === 'string') {
				chunks.push(Buffer.from(chunk));
			} else {
				chunks.push(chunk);
			}
		});

		stream.on('end', () => {
			resolve(Buffer.concat(chunks));
		});

		stream.on('error', (err) => {
			reject(err);
		});
	});
}

function encodeText(text: string): string {
	const encodedText = text.replace(/[\u0080-\uFFFF]/g, (match) => {
		return `&#${match.charCodeAt(0)};`;
	});
	return encodedText;
}
