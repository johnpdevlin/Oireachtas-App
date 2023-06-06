/** @format */

import { GetStaticPaths, GetStaticProps } from 'next/types';

import Head from 'next/head';
import { Container } from '@mui/material';
import Header from '../../UI-Components/Header';

import fetchMember from '../../Fetcher/OireachtasAPI/member';
import ConstituencyLayout from '../../UI-Components/Constituency/ConstituencyLayout';
import { ParsedUrlQuery } from 'querystring';
import { member } from '../../Models/UI/member';

export default function Constituency(props: { uri: string; members: JSON[] }) {
	let members: member[] = JSON.parse(props.members.toString());
	members = members.filter((m) => m.constituency?.uri == props.uri);

	const name = members[0].constituency!.name;
	const seats = members.length;

	// const members = props.members.map((m) => {
	// 	return memberFormatter(m.member);
	// });

	// const [selectedDail, setSelectedDail] = useState(() => {
	// 	return 33;
	// });

	// const parseSelectedTDs: member = members.filter((m: member) => {
	// 	return m.dails!.find((d) => d.houseNo == selectedDail);
	// });

	// const [selectedTDs, setSelectedTDs] = useState(() => {
	// 	return parseSelectedTDs;
	// });

	// const imgUrl = `https://data.oireachtas.ie/ie/oireachtas/member/id/${member.uri}/image/large`;

	return (
		<>
			<Head>
				<title>{name} </title>
				<meta
					name='description'
					content={`Informational content for ${name} constituency`}
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Header />
			<Container>
				<ConstituencyLayout name={name} members={members} />
				<footer></footer>
			</Container>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: 'blocking', //indicates the type of fallback
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug }: ParsedUrlQuery = params!;

	const members = await fetchMember({
		constId: slug?.toString(),
		houseNo: 33,
		serialized: true,
	});

	return {
		props: {
			uri: slug,
			members: members,
		},
		// revalidate: 43200, // 12 hours
	};
};

// Bertie-Ahern.D.1977-07-05
// 	// Stephen-Donnelly.D.2011-03-09
// 	// Ivana-Bacik.S.2007-07-23
