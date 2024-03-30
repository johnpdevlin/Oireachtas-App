/** @format */
import firestore from '@/FirestoreDB/index';
export default async function getDocsFromDB<T>(
	collection: string,
	id: string
): Promise<T[]> {
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
		return documents.push(doc.data() as T);
	});

	return documents;
}
