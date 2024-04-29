/** @format */
import fetchTDpageData from '@/FirestoreDB/read/page_data/td';
import Layout from '@/Components/_layout';
import { AttendanceData } from '@/models/pages/attendance';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MemberPageBioData } from '@/models/pages/member/member';
import details from '@/Data/website';
import Head from 'next/head';
import TDlayout from '@/Components/Layouts/TD/profile_layout';

export default function TeachtaDála(props: { bio: JSON; attendance: JSON }) {
	const bio = JSON.parse(props.bio.toString()) as MemberPageBioData;
	const attendance = JSON.parse(props.attendance.toString()) as AttendanceData;

	return (
		<>
			<Layout>
				<>
					<Head>
						<title>
							{bio.fullName} TD - {details.name}
						</title>
						<meta
							name='description'
							content={`${bio.fullName} is a ${
								bio.parties[0].dateRange.end! ? ' former ' : ''
							}${bio.parties[0].name} TD, representing ${bio!.constituencies!
								.dail![0]!
								.name!}. This page contains biographical details, and records of attendance, votes and questions asked.`}
						/>
					</Head>
					<TDlayout bio={bio} attendance={attendance} />
				</>
			</Layout>
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
	const { uri } = params!;

	const { bio, attendance } = await fetchTDpageData(uri as string);

	return {
		props: {
			bio: JSON.stringify(bio),
			attendance: JSON.stringify(attendance),
		},
		revalidate: 1728000, // 30 days
	};
};
