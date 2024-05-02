/** @format */

import fetchMembers from '@/functions/APIs/Oireachtas/member/raw/_member_details';
import parseInterestsReport from '@/functions/interests/register/_parse_interests_pdf';
import { writeObjsToFirestore } from '@/FirestoreDB/write';
import { assignMemberURIsAndNames } from '@/functions/_utils/memberURIs';

const exportMemberInterestsRecords = async (): Promise<void> => {
	console.info('Beggining exporting of member interests.');
	const collection = 'interests';
	const url =
		'https://data.oireachtas.ie/ie/oireachtas/members/registerOfMembersInterests/dail/2024/2024-02-21_register-of-member-s-interests-dail-eireann-2023_en.pdf';

	const { dateDeclared, year } = parseDateDeclaredAndYear(url);

	try {
		const members = await fetchMembers({ chamber: 'dail', house_no: 33 });
		const interests = await parseInterestsReport(url);
		const memberURIpairs = members?.map((member) => {
			return {
				name: `${member.lastName}, ${member.firstName}`.toLowerCase(),
				uri: member.memberCode,
			};
		});
		const names = interests?.map((interest) =>
			interest.name?.toLowerCase()
		) as string[];
		const matches = assignMemberURIsAndNames(names, memberURIpairs!);

		const formattedInterests = interests.map((interest) => {
			const uri = matches.matches.find(
				(ma) => ma.name.toLowerCase() === interest.name?.toLowerCase()
			)?.uri;

			delete interest.name;
			return { uri: uri, url, dateDeclared, year, ...interest };
		});
		return await writeObjsToFirestore(collection, formattedInterests);
	} catch (error) {
		console.error('Error exporting records to Firestore:', error);
	}
};

function parseDateDeclaredAndYear(url: string) {
	const relevantStr = url.split('/').at(-1);
	const dateDeclared = relevantStr?.slice(0, 10);
	const year = relevantStr?.slice(-11, -7);
	return { dateDeclared, year };
}

export { exportMemberInterestsRecords };
