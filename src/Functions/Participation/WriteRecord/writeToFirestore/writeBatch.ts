/** @format */

import { doc, writeBatch } from 'firebase/firestore';
import {
	groupParticipationRecord,
	participationRecord,
} from '../../../Models/UI/participation';
import { firestore } from '../../../Seeds';

export async function writeAggregateRecordsBatch(
	records: (participationRecord | groupParticipationRecord)[]
): Promise<void> {
	const batch = writeBatch(firestore); // Get a new write batch

	for (let r of records) {
		if (r.uri != undefined) {
			const ref = doc(
				firestore, // db
				'Participation Records (Aggregated)', // collection name
				`${r.uri}-${r.house}-${r.houseNo}-PR` // document name
			);
			batch.set(ref, r);
		}
	}

	setTimeout(async function () {
		await batch.commit();
	}, 1); // commits batch to firestore

	console.log(`Records successfully committed at ${new Date(Date.now())}`);
}
