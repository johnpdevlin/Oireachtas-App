/** @format */
import { Stack } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import BasicDetails from './BasicDetails';
import { MemberBioData } from '@/functions/processes/td/_all_current_agg_td_details';

function ProfileCard(props: { member: MemberBioData }) {
	console.log(props.member.offices);
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
				<BasicDetails member={props.member} />
			</Stack>
		</>
	);
}

export default ProfileCard;
