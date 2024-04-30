/** @format */

import { NextApiRequest, NextApiResponse } from 'next';
import firestore from '@/FirestoreDB/index';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).end(); // Method Not Allowed
	}

	const { collection, id } = req.query;

	try {
		const documents = await getDocsFromDB(collection as string, id as string);
		res.status(200).json(documents);
	} catch (error) {
		console.error('Error fetching documents from Firestore:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

async function getDocsFromDB<T>(collection: string, id: string): Promise<T[]> {
	// Get collection ref
	const docsRef = firestore.collection(collection);

	// Create a query against the collection URI
	const snapshot = await docsRef.where('uri', '==', id).get();
	if (snapshot.empty) {
		console.log('No matching documents.');
		return [];
	}

	const documents: T[] = [];
	snapshot.forEach((doc) => {
		documents.push(doc.data() as T);
	});

	return documents;
}
