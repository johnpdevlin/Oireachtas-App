/** @format */
import { Stack } from '@mui/material';
import ProfileHeader from '../ProfileHeader';
import BasicDetails from './BasicDetails';
import { ScreenSize } from '@/models/ui';
import { MemberBioData } from '@/models/ui/member';

function ProfileCard(props: { member: MemberBioData; size: ScreenSize }) {
	return (
		<>
			<Stack direction='column' sx={{ ml: 1.5, mr: 2 }}>
				<Stack direction='column' sx={{ ml: 0.9, mt: 1, mb: 1 }}>
					<ProfileHeader
						name={props.member.fullName}
						offices={props.member.offices}
						textAlign='left'
					/>
				</Stack>
				<BasicDetails member={props.member} size={props.size} />
			</Stack>
		</>
	);
}

export default ProfileCard;
