/** @format */

import { ThemeProvider } from '@emotion/react';
import {
	CssBaseline,
	Box,
	Container,
	Paper,
	Typography,
	Grid,
	createTheme,
} from '@mui/material';
import Link from 'next/link';
import { member } from '../../Models/UI/member';
import TDcard from '../TDcard';

const mdTheme = createTheme();

/** @format */
export default function IndexLayout(props: {
	name: string;
	members: member[];
	parties: any[];
	constits: any[];
}) {
	const constitOutput = () => {
		let count = 1;
		let array: any[][] = [];
		let cons: any[] = [];
		for (let c of props.constits) {
			cons.push(c.constituencyOrPanel!);
			if (cons.length == 10) {
				console.log('hello');
				array.push(cons);
				cons = [];
			} else if (count == props.constits.length) {
				array.push(cons);
			}
			count++;
		}
		return array;
	};

	return (
		// <>
		// 	<main>
		// 		<ThemeProvider theme={mdTheme}>
		// 			<CssBaseline />
		// 			{/* NAME / TITLE */}
		// 			<Typography
		// 				variant='h2'
		// 				color='text.primary'
		// 				align='center'
		// 				sx={{ marginTop: '30px', marginBottom: '30px' }}>
		// 				{props.name}
		// 			</Typography>
		// 			<Grid
		// 				container
		// 				spacing={2}
		// 				sx={{
		// 					minWidth: '100%',
		// 					display: 'flex',
		// 				}}>
		// 				<Grid item sx={{}}>
		// 					<Paper
		// 						sx={{
		// 							p: 2.5,
		// 							display: 'flex',
		// 							minWidth: '100%',
		// 							minHeight: '100%',

		// 							flexDirection: 'column',
		// 						}}>
		// 						{/* PARTIES */}
		// 						<Typography
		// 							variant='h3'
		// 							color='text.secondary'
		// 							align='left'
		// 							marginBottom={3}>
		// 							Parties
		// 						</Typography>

		// 						<ul>
		// 							{props.parties.map((p) => {
		// 								return (
		// 									<li>
		// 										<Link href={`/party/${p.party.partyCode}`}>
		// 											{p.party.showAs}
		// 										</Link>
		// 									</li>
		// 								);
		// 							})}
		// 						</ul>
		// 					</Paper>
		// 				</Grid>

		// 				<Grid item>
		// 					<Paper
		// 						sx={{
		// 							p: 2.0,
		// 							display: 'flex',
		// 							minWidth: '100%',
		// 							minHeight: '100%',
		// 							flexDirection: 'column',
		// 						}}>
		// 						<Typography
		// 							variant='h3'
		// 							color='text.secondary'
		// 							align='left'
		// 							marginBottom={3}>
		// 							Constituencies
		// 						</Typography>

		// 						<Grid container>
		// 							<Grid item>
		// 								<ul>
		// 									{constitOutput()[0].map((c) => {
		// 										return (
		// 											<li>
		// 												<Link href={`/constituency/${c.representCode}`}>
		// 													{c.showAs}
		// 												</Link>
		// 											</li>
		// 										);
		// 									})}
		// 								</ul>
		// 							</Grid>
		// 							<Grid item>
		// 								<ul>
		// 									{constitOutput()[1].map((c) => {
		// 										return (
		// 											<li>
		// 												<Link href={`/constituency/${c.representCode}`}>
		// 													{c.showAs}
		// 												</Link>
		// 											</li>
		// 										);
		// 									})}
		// 								</ul>
		// 							</Grid>
		// 							<Grid item>
		// 								<ul>
		// 									{constitOutput()[2].map((c) => {
		// 										return (
		// 											<li>
		// 												<Link href={`/constituency/${c.representCode}`}>
		// 													{c.showAs}
		// 												</Link>
		// 											</li>
		// 										);
		// 									})}
		// 								</ul>
		// 							</Grid>
		// 							<Grid item>
		// 								<ul>
		// 									{constitOutput()[3].map((c) => {
		// 										return (
		// 											<li>
		// 												<Link href={`/constituency/${c.representCode}`}>
		// 													{c.showAs}
		// 												</Link>
		// 											</li>
		// 										);
		// 									})}
		// 								</ul>
		// 							</Grid>
		// 						</Grid>
		// 					</Paper>
		// 				</Grid>
		// 			</Grid>
		// 			{/* CONSTITUENCIES */}

		// 			<Paper
		// 				sx={{
		// 					p: 2.0,
		// 					display: 'flex',
		// 					minWidth: '100%',
		// 					marginTop: '50px',
		// 					flexDirection: 'column',
		// 				}}>
		// 				<Grid container>
		// 					{/* TD CARDS */}
		// 					<Typography
		// 						variant='h3'
		// 						color='text.secondary'
		// 						align='left'
		// 						marginBottom={3}>
		// 						Teachta Dála
		// 					</Typography>
		// 					<Grid
		// 						container
		// 						spacing={2}
		// 						sx={{
		// 							minWidth: '100%',
		// 							direction: 'row',
		// 							display: 'flex',
		// 							alignItems: 'center',
		// 							justifyContent: 'center',
		// 						}}>
		// 						{props.members.map((member, index) => {
		// 							return <TDcard member={member} />;
		// 						})}
		// 					</Grid>
		// 				</Grid>
		// 			</Paper>
		// 		</ThemeProvider>
		// 	</main>
		// </>
	);
}
