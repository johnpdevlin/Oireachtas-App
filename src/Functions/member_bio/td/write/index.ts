/** @format */

import { writeObjToFirestore } from '@/FirestoreDB/write';
import processAllMemberDetails from '@/functions/member_bio/td/agg_data/_all_current_agg_td_details';
import shaveUnneccessaryBioData from './shave_data';

const exportTDbioData = async (): Promise<void> => {
	console.info('Beggining exporting of member bio data.');
	const collection = 'td';

	const members = await processAllMemberDetails();

	for (const member of members) {
		try {
			const shavedMember = shaveUnneccessaryBioData(member);

			const write = await writeObjToFirestore(collection, shavedMember);

			if (write!)
				console.info(
					`${member.fullName} bio data processed and exported successfully.`
				);
		} catch (error) {
			console.error(
				`Error exporting bio data for ${member.uri} to Firestore:`,
				error
			);
		}
	}
	console.info(
		`All ${collection} bio data procsessed and exported successfully.`
	);
};

export { exportTDbioData };
