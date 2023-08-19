/** @format */

import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
	Stack,
	useTheme,
} from '@mui/material';

function ProfileTable() {
	const theme = useTheme();

	return (
		<>
			<Table size='small'>
				<TableBody>
					<TableRow>
						<TableCell>
							<Typography variant='body2' align='left'>
								Party:
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>Fine Gael</b>
								<small>
									<i> formerly Nazi Party</i>
								</small>
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Typography
								variant='body2'
								color='theme.text.secondary'
								align='left'>
								Constituency:
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>Dublin West</b>

								<small>
									<i> formerly Baden-Baden</i>
								</small>
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Typography variant='body2' align='left'>
								Duration in Oireachtas:
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>1 year, 2 months</b>
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Typography variant='body2' align='left'>
								Offials Roles:
							</Typography>
						</TableCell>
						<TableCell>
							<Stack direction='column'>
								<Typography
									variant='body2'
									sx={{ fontWeight: 'bold' }}
									align='left'>
									Tánaiste, <br />
									Minister for Foreign Affairs and Trade
								</Typography>
							</Stack>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
}

export default ProfileTable;
