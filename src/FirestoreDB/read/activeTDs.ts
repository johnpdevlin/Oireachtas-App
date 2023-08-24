/** @format */

import firestore from '..';

export default async function getActiveTDs() {
	// Get collection ref
	const membersRef = firestore.collection('td');

	// Create a query against the collectionT
	const snapshot = await membersRef.where('isActiveTD', '==', true).get();
	if (snapshot.empty) {
		console.log('No matching documents.');
		return;
	}

	const members = [];
	snapshot.forEach((doc) => {
		return members.push(doc.data());
	});
	return members;
}
