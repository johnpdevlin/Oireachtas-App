/** @format */
import { Stack, Typography } from '@mui/material';
export default function ProfileHeader(props: {
	name: string;
	textAlign: string;
}): JSX.Element {
	return (
		<>
			<Stack direction='column'>
				<Typography
					variant='h2'
					sx={{ whiteSpace: 'nowrap', textAlign: `${props.textAlign}` }}
					title={'Member Name'}>
					{props.name}
				</Typography>
				{/* REQUIRES F()s to be fully implemented */}
				<Typography
					variant='h6'
					sx={{ whiteSpace: 'pre-line', textAlign: `${props.textAlign}` }}
					title={'Member current offices and party role(s)'}>
					Taoiseach, Minister for Enterprise, Trade and Employment, Leader of
					Fine Gael
				</Typography>
				{/* REQUIRES F()s to be fully implemented */}
			</Stack>
		</>
	);
}
