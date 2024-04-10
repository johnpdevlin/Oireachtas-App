/** @format */

import { MemberBioData } from '@/models/ui/member';
import { Breakpoint, Stack } from '@mui/material';
import BasicDetails from './BasicDetails';
import ProfileHeader from './ProfileHeader';

export default function ProfileCard(props: {
	member: MemberBioData;
	size: Breakpoint;
}) {
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
