/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Avatar,
	Typography,
} from '@mui/material';
import { Work, AccountBalance } from '@mui/icons-material';
import { green } from '@mui/material/colors';

export default function FormerPositions() {
	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label='recipe'>
							<AccountBalance />
						</Avatar>
					}
					title={<Typography variant='h6'>Former Offices </Typography>}
				/>

				<CardContent>
					<Typography variant='body2' color='text.secondary'>
						This impresup of frozen peas along with the mussels, if you like.
					</Typography>
				</CardContent>
			</Card>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label='recipe'>
							<Work fontSize='small' />
						</Avatar>
					}
					title={<Typography variant='h6'>Party Positions </Typography>}
				/>

				<CardContent>
					<Typography variant='body2' color='text.secondary'>
						This impresup of frozen peas along with the mussels, if you like.
					</Typography>
				</CardContent>
			</Card>
		</>
	);
}
