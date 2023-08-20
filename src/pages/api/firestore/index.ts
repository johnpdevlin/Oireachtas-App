/** @format */

import db from '@/FirestoreDB/index';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { token, id, collection, overwrite, id_field } = req.query;
	const apiSecret = process.env.API_SECRET;

	// if (token !== apiSecret) {
	// 	return res.status(808).json({ message: 'Access not authorised.' });
	// }

	try {
		if (req.method === 'POST') {
			const newDocRef = await db.collection(collection as string).add({
				...req.body,
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
