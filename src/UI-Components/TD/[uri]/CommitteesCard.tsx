/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Avatar,
	Typography,
	Stack,
} from '@mui/material';
import {
	CropSquare,
	CropSquareRounded,
	Groups,
	Square,
} from '@mui/icons-material';
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

				<CardContent sx={{ paddingTop: 0 }}>
					<Stack direction='column'>
						<Stack direction='row' gap={1}>
							<CropSquareRounded fontSize='small' />
							<Typography variant='body2' color='text.secondary'>
								Irish Language, Gaeltacht and the Irish-speaking Community
							</Typography>
						</Stack>
						<Stack direction='row' gap={1}>
							<CropSquare fontSize='small' />
							<Typography variant='body2' color='text.secondary'>
								Social Protection, Community and Rural Development and the
								Islands
							</Typography>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}
