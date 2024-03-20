/** @format */

import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';
import firestore from '../..';

export default async function getActiveTDs(): Promise<MemberBioData[]> {
	// Get collection ref
	const membersRef = firestore.collection('td');

	// Create a query against the collectionT
	const snapshot = await membersRef.where('isActiveTD', '==', true).get();
	if (snapshot.empty) {
		console.log('No matching documents.');
		return [];
	}

	const members: MemberBioData[] = [];
	snapshot.forEach((doc) => {
		return members.push(doc.data() as MemberBioData);
	});
	return members;
}
