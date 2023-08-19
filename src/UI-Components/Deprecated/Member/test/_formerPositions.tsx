/** @format */

import * as React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import CardContent from '@mui/material/CardContent';

import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';
import { deepOrange, green, red } from '@mui/material/colors';

import Work from '@mui/icons-material/Work';
import AccountBalance from '@mui/icons-material/AccountBalance';

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
