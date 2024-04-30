/** @format */

import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).end(); // Method Not Allowed
	}

	const { collection, params } = req.query;

	try {
		// Convert params to JSON
		const parsedParams = JSON.parse(params as string);

		// Call the by_uri API route for each param and aggregate the results
		const batch = await Promise.all(
			parsedParams.map(async (param: any) => {
				try {
					const response = await fetch(
						`/api/firestore/read/uri?collection=${collection}&id=${param.id}`
					);

					if (!response.ok) {
						throw new Error(`Failed to fetch data for ${param.id}`);
					}

					return response.json();
				} catch (error) {
					console.error(`Error fetching data for ${param.id}:`, error);
					return { error: `Error fetching data for ${param.id}` };
				}
			})
		);

		// Respond with the batched results
		res.status(200).json(batch);
	} catch (error) {
		console.error('Error parsing query parameters:', error);
		res.status(400).json({ error: 'Invalid query parameters' });
	}
};
