/** @format */

import { Typography, Divider, Stack } from '@mui/material';
import { MarkunreadMailbox } from '@mui/icons-material';

export default function ContactCard(props: { label: string; address: string }) {
	return (
		<>
			<Stack direction='row'>
				<MarkunreadMailbox
					fontSize='small'
					sx={{ textAlign: 'left', mr: 0.5 }}
				/>
				<Typography variant='body1'>{props.label}</Typography>
			</Stack>
			<Divider />

			<Typography variant='body2' color='text.secondary'>
				{props.address}
			</Typography>
		</>
	);
}
