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
export default function ConstituencyLayout(props: {
	name: string;
	members: member[];
}) {
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
						<Container
							maxWidth='lg'
							sx={{ mt: 5, mb: 4, maxWidth: '100%' }}></Container>
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
								{props.members.map((member, index) => {
									return <TDcard member={member} />;
								})}
							</Grid>
						</Paper>
					</Box>
				</ThemeProvider>
			</main>
		</>
	);
}
