/** @format */

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import RecordsTabs from './RecordsTabs';
import TDprofile from './ProfileCard';
import ParticipationTable from '../ParticipationTable';
import {
	groupParticipationRecord,
	participationRecord,
} from '../../Models/UI/participation';
import { member } from '../../Models/UI/member';
import SideBar from './SideBar';

const drawerWidth: number = 240;

const mdTheme = createTheme();

export default function TDlayout(props: {
	participation: (participationRecord | groupParticipationRecord)[];
	member: member;
}) {
	let maxDate: Date = new Date();
	if (props.member.cessation!) {
		//sets max date for calendar to last day as member or today
		maxDate = new Date(props.member.cessation);
	}
	let minDate: Date = new Date(props.member.firstElected);

	return (
		<>
			<main>
				<ThemeProvider theme={mdTheme}>
					<Box sx={{ display: 'flex' }}>
						<CssBaseline />

						<Box
							component='main'
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? theme.palette.grey[100]
										: theme.palette.grey[900],
								flexGrow: 1,

								// overflow: 'auto',
							}}>
							<Container maxWidth='lg' sx={{ mt: 5, mb: 4, maxWidth: '100%' }}>
								<Grid container spacing={2} sx={{ maxWidth: '100%' }}>
									{/* Chart */}
									<Grid item sx={{ display: 'flex' }} lg={8}>
										<TDprofile member={props.member} />
									</Grid>
									{/* Recent Deposits */}
									<Grid item sx={{ display: 'flex', minWidth: '30%' }} lg={4}>
										{props.member.offices! ? (
											<SideBar offices={props.member.pastOffices!} />
										) : null}
									</Grid>
									{/* Participation Table */}
									<Grid item xs={12}>
										<ParticipationTable participation={props.participation} />
									</Grid>
									{/* Records - Votes, Questions //Choose by Calendar  */}
									<Grid item xs={12}>
										<Paper
											sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
											<RecordsTabs
												minDate={minDate}
												maxDate={maxDate}
												member={props.member.uri}
											/>
										</Paper>
									</Grid>
								</Grid>
							</Container>
						</Box>
					</Box>
				</ThemeProvider>
			</main>
		</>
	);
}
