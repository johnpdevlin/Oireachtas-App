/** @format */

import { firestore } from '../../../firestoreDB';
import {
	collection,
	query,
	where,
	getDocs,
	DocumentData,
} from 'firebase/firestore';
import {
	aggRecordRequest,
	dateRecordRequest,
} from '../../../Models/firestoreRequests';

export async function getAllAggRecords() {
	const querySnapshot = await getDocs(
		collection(firestore, 'Participation Records (Aggregated)')
	);

	return querySnapshot;
}

export async function getAggMemberRecords(props) {
	const q = query(
		collection(firestore, 'Participation Records (Aggregated)'),
		where('members', 'array-contains', props.uri),
		where('houseNo', '==', props.houseNo?.toString())
	);

	const querySnapshot = await getDocs(q);

	let datesRecords = [];

	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		if (doc.data() != undefined) {
			datesRecords.push(doc.data());
		}
	});

	return datesRecords;
}

export async function getAggConstituencyRecords(props) {
	const q = query(
		collection(firestore, 'Participation Records (Aggregated)'),
		where('type', '==', props.type),
		where('houseNo', '==', props.houseNo)
	);

	const querySnapshot = await getDocs(q);

	const datesRecords = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		datesRecords.push(doc.data());
	});

	return datesRecords;
}
