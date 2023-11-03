/** @format */

import { writeObjToFirestore } from '.';
import processAllMemberDetails from '@/functions/processes/td/get/all_td_details';

export default async function writeTdsToFirestore(houseNo: number) {
	console.info('Getting member data to write to firestore...');
	const m = await processAllMemberDetails();

	console.info('Writing tds to firestore...');
	m.forEach((member) => {
		writeObjToFirestore('td', m);
	});

	console.info('Writing process completed.');
}
