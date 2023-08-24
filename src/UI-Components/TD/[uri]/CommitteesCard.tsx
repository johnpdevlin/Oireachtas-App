/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Avatar,
	Typography,
} from '@mui/material';
import { Groups } from '@mui/icons-material';
import { green } from '@mui/material/colors';

export default function CommitteesCard() {
	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label='committees icon'>
							<Groups />
						</Avatar>
					}
					title={<Typography variant='h6'>Committees</Typography>}
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
