/** @format */
import firestore from '@/FirestoreDB/index';
export default async function getDocFromDB<T>(
	collection: string,
	id: string
): Promise<T | undefined> {
	// Get collection ref
	const docRef = firestore.collection(collection);

	// Create a query against the collection
	const snapshot = await docRef.where('uri', '==', id).get();
	if (snapshot.empty) {
		console.log('No matching documents.');
		return undefined;
	}

	if (snapshot.docs.length === 1) {
		return snapshot.docs[0].data() as T;
	} else {
		console.error(
			'Multiple matching documents.\n',
			snapshot.docs.map((doc) => doc.data())
		);
		return undefined;
	}
}
