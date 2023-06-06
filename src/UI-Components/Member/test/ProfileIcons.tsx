/** @format */

import FacebookIcon from '@mui/icons-material/Facebook';
import { Stack } from '@mui/material';

function ProfileIcons() {
	return (
		<>
			<Stack direction='row' sx={{ mt: 2 }}>
				<FacebookIcon fontSize='large' sx={{ color: '#02577a' }} />
				<FacebookIcon fontSize='large' />
				<FacebookIcon fontSize='large' />
			</Stack>
		</>
	);
}

export default ProfileIcons;
