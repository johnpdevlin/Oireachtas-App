/** @format */

import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import processAllMemberDetails from '@/functions/processes/td/_all_current_agg_td_details';
import { writeObjToFirestore } from '@/FirestoreDB/write';
import axios from 'axios';
import getMultiMembersAPIdetails from '../../functions/APIs/Oireachtas/member/formatted/_multi_member_details';
import writeTds from '@/FirestoreDB/write/td';
import writeTdsToFirestore from '@/FirestoreDB/write/td';
import firestore from '@/FirestoreDB';
import getActiveTDs from '@/FirestoreDB/read/activeTDs';
import fetchConstituencies from '../../functions/APIs/Oireachtas/constit/_index';
import { serialize } from 'v8';
import fetchParties from '../../functions/APIs/Oireachtas/party/_index';
import fetchMembers from '../../functions/APIs/Oireachtas/member/raw/_member_details';
import { RawMember } from '@/models/oireachtasApi/member';
import { PartyAPI } from '@/models/oireachtasApi/party';
import { ConstituencyAPI } from '../models/oireachtasApi/constituency';
import getMemberAPIdetails from '../../functions/APIs/Oireachtas/member/formatted/_member_details';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import Layout from '@/UI-Components/_layout';
import { Button, Stack, TextField, Typography } from '@mui/material';
import processChamberAttendanceReports from '@/functions/attendance/deprecated/get_chamber_attendance_report';
import processCommitteeReportsBetweenDates from '@/functions/attendance/commitee/report/_committee_attendance';
import scrapeAllWikiConstituencies from '@/functions/wikipedia_pages/constit/all_constits';
import processAllCommitteeInfo from '@/functions/oireachtas_pages/committee/_all_committees_info';
import scrapeCommitteesBaseDetails from '@/functions/oireachtas_pages/committee/base_info';
import { SetStateAction, useState } from 'react';
import parseInterestsReport from '@/functions/interests/register/_parse_interests_pdf';
import urls from '@/Data/member-interests/register-urls';
import processSittingReportsByTerm from '@/functions/attendance/member_report/_attendance_reports';
import { getMemberCommitteeAttendanceRecords } from '@/functions/attendance/commitee/member_records/_member_attendance_records';

const inter = Inter({ subsets: ['latin'] });

export default function Tests() {
	const [inputValue1, setInputValue1] = useState('');

	const handleInput1Change = (e: {
		target: { value: SetStateAction<string> };
	}) => {
		setInputValue1(e.target.value);
	};

	const writeIndividualRegisterJSON = async () => {
		try {
			const response = await parseInterestsReport(
				'https://data.oireachtas.ie/ie/oireachtas/members/registerOfMembersInterests/dail/2023/2023-02-22_register-of-member-s-interests-dail-eireann-2022_en.pdf'
			);

			if (!response) {
				throw new Error('No data received from parseInterestsReport');
			}

			await axios
				.post('/api/write-json-file', {
					data: response,
					filename: 'memberRegister.json',
				})
				.then((response) => {
					console.log(response.data);
				});
		} catch (error) {
			console.error('Error in writePropertyJSON:', error);
			// Handle the error appropriately
		}
	};

	const writeIndividualPropertyJSON = async () => {
		try {
			const response = await parseInterestsReport(
				'https://data.oireachtas.ie/ie/oireachtas/members/registerOfMembersInterests/dail/2023/2023-02-22_register-of-member-s-interests-dail-eireann-2022_en.pdf'
			);

			if (!response) {
				throw new Error('No data received from parseInterestsReport');
			}

			const property = response
				.map((member) => ({
					name: member.name,
					properties: member.property ? [member.property] : [], // Ensure properties is an array
				}))
				.filter((member) => member.properties.length > 0);

			if (!property) {
				throw new Error('No property data found');
			}

			await axios
				.post('/api/write-json-file', {
					data: property,
					filename: 'memberProperties.json',
				})
				.then((response) => {
					console.log(response.data);
				});
		} catch (error) {
			console.error('Error in writePropertyJSON:', error);
			// Handle the error appropriately
		}
	};

	const writePropertyJSON = async () => {
		type PropertyData = {
			[year: number]: Array<{ name: string; properties: string[] }>;
		};

		let propertyData: PropertyData = {}; // Initialize as an empty object
		const registerURLs = urls.map(async (u) => {
			try {
				const response = await parseInterestsReport(u.url);

				if (!response) {
					throw new Error('No data received from parseInterestsReport');
				}

				const property = response
					.map((member) => ({
						name: member.name,
						properties: member.property ? [member.property] : [], // Ensure properties is an array
					}))
					.filter((member) => member.properties.length > 0);
				console.log(property);
				if (!property) {
					throw new Error('No property data found');
				}

				propertyData[u.year] = property;
			} catch (error) {
				console.error('Error in writePropertyJSON:', error);
				// Handle the error appropriately
			}
		});

		// Wait for all promises to resolve using Promise.all
		await Promise.all(registerURLs);

		// Now you can write the JSON file
		await axios
			.post('/api/write-json-file', {
				data: propertyData,
				filename: 'memberProperties.json',
			})
			.then((response) => {
				console.log(response.data);
			});
	};

	return (
		<>
			<Head>
				<title>Create Next1 App</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Layout>
				<>
					<Stack direction='column' gap={2} margin={3}>
						<Typography variant='h4' textAlign='center'>
							Fetching & Parsing
						</Typography>

						<Button
							variant='contained'
							onClick={() =>
								console.log(processSittingReportsByTerm('dail', 33))
							}>
							Attendance Report for Dáil Term
						</Button>
						<Button
							variant='contained'
							onClick={() =>
								console.log(
									processChamberAttendanceReports({
										chamber: 'dail',
										house_no: 33,
									})
								)
							}>
							Participation for Dáil Term
						</Button>
						<Button
							variant='contained'
							onClick={() =>
								console.info(
									processCommitteeReportsBetweenDates(
										33,
										'01/01/2020',
										'01/01/2024'
									)
								)
							}>
							Committee Attendance Reports (2020-2020)
						</Button>
						<Button
							variant='contained'
							onClick={() =>
								console.info(
									getMemberCommitteeAttendanceRecords(
										'01/01/2020',
										'01/01/2023'
									)
								)
							}>
							Member Commitee Attendance Records (2020-2022)
						</Button>
						<Button
							variant='contained'
							onClick={async () => console.log(processAllMemberDetails())}>
							Current TD Details
						</Button>
						<Button
							variant='contained'
							onClick={async () => console.log(scrapeCommitteesBaseDetails())}>
							Committees Base Details
						</Button>
						<Button
							variant='contained'
							onClick={async () =>
								console.log(await processAllCommitteeInfo())
							}>
							All Committee Info
						</Button>
						<Button
							variant='contained'
							onClick={() => console.log(scrapeAllWikiConstituencies())}>
							Wiki Constituency Details
						</Button>
					</Stack>
					<Stack direction='column' gap={2} margin={3}>
						<Typography variant='h4' textAlign='center'>
							Reading & Writing
						</Typography>

						<TextField
							id='input1'
							label=''
							variant='outlined'
							value={inputValue1}
							onChange={handleInput1Change}
							placeholder='Enter Test Text'
						/>
						<Button
							variant='contained'
							onClick={() => {
								writeObjToFirestore('test1', { test: inputValue1 });
							}}>
							Write Test to Firestore
						</Button>

						{/* <Button
								variant='contained'
								onClick={() => {
									
								}}>
								Read Test from Firestore
							</Button> */}
					</Stack>
					<Stack direction='column' gap={2} margin={3}>
						<Typography variant='h4' textAlign='center'>
							Parsing PDFs
						</Typography>

						<Button
							variant='contained'
							onClick={() =>
								console.log(
									parseInterestsReport(
										'https://data.oireachtas.ie/ie/oireachtas/members/registerOfMembersInterests/dail/2023/2023-02-22_register-of-member-s-interests-dail-eireann-2022_en.pdf'
									)
								)
							}>
							Parse Register of Interests PDF
						</Button>
						<Button
							variant='contained'
							onClick={async () => {
								writeIndividualRegisterJSON();
							}}>
							Write 2022 Member Interests JSON File
						</Button>
						<Button
							variant='contained'
							onClick={async () => {
								writeIndividualPropertyJSON();
							}}>
							Write 2022 Property JSON File
						</Button>
						<Button
							variant='contained'
							onClick={async () => {
								writePropertyJSON();
							}}>
							Write Property JSON File
						</Button>
					</Stack>
				</>
			</Layout>
		</>
	);
}
