/** @format */

import db from '@/FirestoreDB/index';
import handleCors from '@/pages/api/middleware/corsMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await handleCors(req, res);

	const { token, id, collection, overwrite, id_field } = req.query;

	try {
		if (req.method === 'POST') {
			const data = JSON.parse(req.query.data as string);
			const newDocRef = await db.collection(collection as string).add({
				...data,
				created: new Date().toISOString(),
			});
			res.status(200).json({ id: newDocRef.id });
		} else if (req.method === 'PUT') {
			await db
				.collection(collection as string)
				.doc(id as string)
				.update({
					...req.body,
					updated: new Date().toISOString(),
				});
		} else if (req.method === 'GET') {
			const doc = await db
				.collection(collection as string)
				.doc(id as string)
				.get();
			if (!doc.exists) {
				res.statusMessage = 'Not found';
				res.status(404).end();
			} else {
				res.status(200).json(doc.data());
			}
		} else if (req.method === 'DELETE') {
			await db
				.collection(collection as string)
				.doc(id as string)
				.delete();
		}
		res.status(200).end();
	} catch (e) {
		res.status(400).end();
	}
};
