/** @format */

import { writeObjToFirestore } from '@/FirestoreDB/write';
import processAllMemberDetails from '@/functions/member_bio/td/_all_current_agg_td_details';
import shaveUnneccessaryBioData from '../shave_data';

const exportTDbioData = async (): Promise<void> => {
	console.info('Beggining exporting of member bio data.');
	const collection = 'td';

	try {
		const members = await processAllMemberDetails();

		for (const member of members) {
			const shavedMember = shaveUnneccessaryBioData(member);

			await writeObjToFirestore(collection, shavedMember);

			console.info(
				` ${member.fullName} bio data processed and exported successfully.`
			);
		}

		console.info(
			`All ${collection} bio data procsessed and exported successfully.`
		);
	} catch (error) {
		console.error('Error exporting records to Firestore:', error);
	}
};

export { exportTDbioData };
