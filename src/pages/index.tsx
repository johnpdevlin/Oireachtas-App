/** @format */

import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import prcAttendanceReports from '@/Functions/Participation/Attendance/prcAttendanceReport';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	// const ff = 'Fianna_Fáil';
	// const sf = 'Sinn_Féin';
	// const sd = 'Social_Democrats_(Ireland)';
	// const fg = 'Fine_Gael';
	// const lp = 'Labour_Party_(Ireland)';
	// const pbp = 'People_Before_Profit–Solidarity';
	// const au = 'Aontú';
	// const gp = 'Green_Party_(Ireland)';
	// const r2c = 'Right_to_Change';

	// sf elections, seanad leaders

	// console.log(scrapePartyPage(`/wiki/${ff}`));
	// console.log(scrapePartyPage(`/wiki/${sf}`));
	// console.log(scrapePartyPage(`/wiki/${sd}`));
	// console.log(scrapePartyPage(`/wiki/${fg}`));
	// console.log(scrapePartyPage(`/wiki/${lp}`));
	// console.log(scrapePartyPage(`/wiki/${gp}`));
	// console.log(scrapePartyPage(`/wiki/${au}`));
	// console.log(scrapePartyPage(`/wiki/${pbp}`));
	// console.log(scrapePartyPage(`/wiki/${r2c}`));
	// console.log(parseCommitteeReport());

	// console.log(
	// 	scrapeOneWikiConstituency('/wiki/Carlow–Kilkenny_(Dáil_constituency)')
	// );

	// console.log(scrapeAllWikiConstituencies());
	// let uri = ''.replaceAll
	// 	console.log(parseCommitteeReport(uri: 'irish-language-gaeltacht-and-the-irish-speaking-community', date: '2023-06-01'));
	// console.log(prcCommittee());
	// c
	//

	console.log(prcAttendanceReports({ chamber: 'dail', house_no: 33 }));
	// console.log(scrapeCommitteesBaseDetails());
	return (
		<>
			<Head>
				<title>Create Next1 App</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={`${styles.main} ${inter.className}`}>
				<div className={styles.description}>
					<p>
						Get started by editing&nbsp;
						<code className={styles.code}>src/pages/index.tsx</code>
					</p>
					<div>
						<a
							href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
							target='_blank'
							rel='noopener noreferrer'>
							By{' '}
							<Image
								src='/vercel.svg'
								alt='Vercel Logo'
								className={styles.vercelLogo}
								width={100}
								height={24}
								priority
							/>
						</a>
					</div>
				</div>

				<div className={styles.center}>
					<Image
						className={styles.logo}
						src='/next.svg'
						alt='Next.js Logo'
						width={180}
						height={37}
						priority
					/>
				</div>

				<div className={styles.grid}>
					<a
						href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
						className={styles.card}
						target='_blank'
						rel='noopener noreferrer'>
						<h2>
							Docs <span>-&gt;</span>
						</h2>
						<p>
							Find in-depth information about Next.js features and&nbsp;API.
						</p>
					</a>

					<a
						href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
						className={styles.card}
						target='_blank'
						rel='noopener noreferrer'>
						<h2>
							Learn <span>-&gt;</span>
						</h2>
						<p>
							Learn about Next.js in an interactive course with&nbsp;quizzes!
						</p>
					</a>

					<a
						href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
						className={styles.card}
						target='_blank'
						rel='noopener noreferrer'>
						<h2>
							Templates <span>-&gt;</span>
						</h2>
						<p>
							Discover and deploy boilerplate example Next.js&nbsp;projects.
						</p>
					</a>

					<a
						href='https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
						className={styles.card}
						target='_blank'
						rel='noopener noreferrer'>
						<h2>
							Deploy <span>-&gt;</span>
						</h2>
						<p>
							Instantly deploy your Next.js site to a shareable URL
							with&nbsp;Vercel.
						</p>
					</a>
				</div>
			</main>
		</>
	);
}
