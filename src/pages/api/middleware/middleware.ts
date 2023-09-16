/** @format */

// pages/api/middleware/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';

export async function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: (
		req: NextApiRequest,
		res: NextApiResponse,
		next: (err?: any) => any
	) => void
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fn(req, res, (err) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
}
