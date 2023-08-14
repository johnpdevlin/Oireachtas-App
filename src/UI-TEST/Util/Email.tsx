/** @format */

import { Typography, Stack } from '@mui/material';

import { AlternateEmail } from '@mui/icons-material';

export default function ContactCard(props: { email: string }) {
	return (
		<>
			<Stack direction='row'>
				<AlternateEmail fontSize='small' sx={{ textAlign: 'left', mr: 0.5 }} />
				<Typography variant='body2' color='text.secondary' title='email'>
					{props.email}
				</Typography>
			</Stack>
		</>
	);
}
