/** @format */

// pages/api/parseXml.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { parseString, OptionsV2 } from 'xml2js';
import handleCors from '@/pages/api/middleware/corsMiddleware';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Record<string, any> | { error: string }>
) {
	// await handleCors(req, res);

	try {
		// Fetch XML data from the provided URL
		const xmlUrl = req.query.xmlUrl as string; // Assuming the XML URL is passed as a query parameter
		const response: AxiosResponse<string> = await axios.get(xmlUrl);

		const xmlData = response.data;

		parseString(xmlData, (err, result) => {
			if (err) {
				console.error(err);
				res.status(500).json({ url: xmlUrl, error: 'Failed to parse XML' });
			} else {
				// Send the parsed data as JSON
				res.status(200).json(result);
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch XML data' });
	}
}
