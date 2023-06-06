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
import { member } from '../../Models/UI/member';
import TDcard from '../TDcard';

const mdTheme = createTheme();

/** @format */
export default function PartyLayout(props: {
	name: string;
	members: member[] | member;
}) {
	let members: member[] = [];

	if (Array.isArray(props.members)!) {
		props.members.forEach((m: member) => members.push(m));
	} else {
		members.push(props.members);
	}

	return (
		<>
			<main>
				<ThemeProvider theme={mdTheme}>
					<CssBaseline />

					<Box
						component='main'
						sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === 'light'
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							flexGrow: 1,
						}}>
						<Container maxWidth='lg' sx={{ mt: 5, mb: 4, maxWidth: '100%' }}>
							<Paper
								sx={{
									p: 2.5,
									display: 'flex',
									minWidth: '100%',
									flexDirection: 'row',
								}}>
								{/* NAME / TITLE */}
								<Typography variant='h2' color='text.primary' align='left'>
									{props.name}
								</Typography>
								{/* TD CARDS */}
								<Grid
									container
									spacing={2}
									sx={{
										minWidth: '100%',
										direction: 'row',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									{members.map((m, index) => {
										return <TDcard member={m} />;
									})}
								</Grid>
							</Paper>
						</Container>
					</Box>
				</ThemeProvider>
			</main>
		</>
	);
}
