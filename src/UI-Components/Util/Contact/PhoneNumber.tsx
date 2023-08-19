/** @format */
import { Typography, Stack } from '@mui/material';
import { Call } from '@mui/icons-material';

export default function PhoneNumber(props: { number: string }) {
	return (
		<>
			<Stack direction='row'>
				<Call fontSize='small' sx={{ textAlign: 'left', mr: 0.5 }} />
				<Typography variant='body2' color='text.secondary' title='phone number'>
					{props.number}
				</Typography>
			</Stack>
		</>
	);
}
