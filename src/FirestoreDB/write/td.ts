/** @format */

import { writeObjToFirestore } from '.';
import processAllMemberDetails from '@/functions/member_bio/td/_all_current_agg_td_details';

export default async function writeTdsToFirestore(houseNo: number) {
	console.info('Getting member data to write to firestore...');
	const m = await processAllMemberDetails();

	console.info('Writing tds to firestore...');
	m.forEach((member) => {
		writeObjToFirestore('td', member);
	});

	console.info('Writing process completed.');
}
