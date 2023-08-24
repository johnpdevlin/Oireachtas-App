/** @format */
import { Stack } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import BasicDetails from './BasicDetails';

function ProfileCard(props: { member: unknown }) {
	return (
		<>
			<Stack direction='column' sx={{ ml: 1.5, mr: 2 }}>
				<Stack direction='column' sx={{ ml: 0.9, mt: 1, mb: 1 }}>
					<ProfileHeader name={props.member.name} textAlign='left' />
				</Stack>
				<BasicDetails />
			</Stack>
		</>
	);
}

export default ProfileCard;
