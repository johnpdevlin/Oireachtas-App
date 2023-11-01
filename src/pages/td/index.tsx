/** @format */
import Head from 'next/head';
import { Inter } from 'next/font/google';
import getMultiMembersAPIdetails from '@/functions/APIs_/Oireachtas_/member_/get_/formatted_/multi_member_details_';
import fetchConstituencies from '@/functions/APIs_/Oireachtas_/constit_/get_';
import fetchParties from '@/functions/APIs_/Oireachtas_/party_/get_';
import { PartyAPI } from '@/models/oireachtasApi/party';
import { ConstituencyAPI } from '@/models/oireachtasApi/constituency';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import TDIndexLayout from '@/UI-Components/TD/Layouts';

const inter = Inter({ subsets: ['latin'] });

export default function Home(props: {
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
				<title>TDs</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<TDIndexLayout
					constituencies={constits}
					parties={parties}
					members={members}
				/>
			</main>
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
