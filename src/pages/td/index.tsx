/** @format */
import Head from 'next/head';
import getMultiMembersAPIdetails from '../../functions/APIs/Oireachtas/member/formatted/_multi_member_details';
import fetchConstituencies from '../../functions/APIs/Oireachtas/constit/_index';
import fetchParties from '../../functions/APIs/Oireachtas/party/_index';
import { PartyAPI } from '@/models/oireachtas_api/party';
import { ConstituencyAPI } from '@/models/oireachtas_api/constituency';
import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';
import Layout from '@/Components/_layout';
import details from '@/Data/website';
import house from '@/Data/house-details';
import { addOrdinalSuffix } from '@/functions/_utils/strings';
import TDIndexLayout from '@/Components/Layouts/TD/index_layout';

export default function TDs(props: {
	constituencies: string;
	parties: string;
	members: string;
}) {
	const constits: ConstituencyAPI[] = JSON.parse(props.constituencies);
	const parties: PartyAPI[] = JSON.parse(props.parties);
	const members: MemberAPIdetails[] = JSON.parse(props.members);

	return (
		<>
			<Head>
				<title>TD Index - {details.name}</title>
				<meta
					name='description'
					content={`This page contains a list of all the current TDs for ${addOrdinalSuffix(
						house.dail.current
					)} Dáil, which can be filtered by party and/or constituency.`}
				/>
			</Head>
			<Layout>
				<TDIndexLayout
					constituencies={constits}
					parties={parties}
					members={members}
				/>
			</Layout>
		</>
	);
}

export async function getStaticProps() {
	const constits = await fetchConstituencies({ chamber: 'dail', house_no: 33 });
	const parties = await fetchParties({ chamber: 'dail', house_no: 33 });
	const members = await getMultiMembersAPIdetails(undefined, {
		chamber: 'dail',
		house_no: 33,
	});

	return {
		props: {
			constituencies: JSON.stringify(constits),
			parties: JSON.stringify(parties),
			members: JSON.stringify(members),
		},
	};
}
