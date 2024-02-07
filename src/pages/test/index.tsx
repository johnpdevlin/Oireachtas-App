/** @format */

import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import processAllMemberDetails from '@/functions/processes/td/get_all_td_details';
import { writeObjToFirestore } from '@/FirestoreDB/write';
import axios from 'axios';
import getMultiMembersAPIdetails from '../../functions/APIs/Oireachtas_/member_/get_/formatted_/multi_member_details_';
import writeTds from '@/FirestoreDB/write/td';
import writeTdsToFirestore from '@/FirestoreDB/write/td';
import firestore from '@/FirestoreDB';
import getActiveTDs from '@/FirestoreDB/read/activeTDs';
import fetchConstituencies from '../../functions/APIs/Oireachtas_/constit_/get_';
import { serialize } from 'v8';
import fetchParties from '../../functions/APIs/Oireachtas_/party_/get_';
import fetchMembers from '../../functions/APIs/Oireachtas_/member_/get_/raw_/get';
import { RawMember } from '@/models/oireachtasApi/member';
import { PartyAPI } from '@/models/oireachtasApi/party';
import { ConstituencyAPI } from '../models/oireachtasApi/constituency';
import getMemberAPIdetails from '../../functions/APIs/Oireachtas_/member_/get_/formatted_/member_details_';
import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import Layout from '@/UI-Components/_layout';
import { Button, Stack, TextField, Typography } from '@mui/material';
import processChamberAttendanceReports from '@/functions/processes/participation/house/get_chamber_attendance_report';
import processCommitteeReportsBetweenDates from '@/functions/processes/participation/get_committee_attendance_report';
import scrapeAllWikiConstituencies from '@/functions/scrape_websites/wikipedia/constit/all_constits';
import processAllCommitteeInfo from '@/functions/scrape_websites/oireachtas/committee/get/all_committeesInfo';
import scrapeCommitteesBaseDetails from '@/functions/scrape_websites/oireachtas/committee/get/base_info';
import { SetStateAction, useState } from 'react';
import parseInterestsReport from '@/functions/scrape_websites/oireachtas/interests/register/_parse_interests_pdf';
import urls from '@/Data/member-interests/register-urls';

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
								console.log(
									processCommitteeReportsBetweenDates(
										'01/01/2020',
										'01/01/2024'
									)
								)
							}>
							Committee Attendance Reports (2020-2023)
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