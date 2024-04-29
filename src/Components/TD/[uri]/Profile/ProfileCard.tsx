/** @format */

import { Breakpoint, Stack } from '@mui/material';
import BasicDetails from './BasicDetails';
import ProfileHeader from './ProfileHeader';
import { MemberPageBioData } from '@/models/pages/member/member';

export default function ProfileCard(props: {
	member: MemberPageBioData;
	size: Breakpoint;
}) {
	return (
		<>
			<Stack direction='column' sx={{}}>
				<Stack direction='column' sx={{ ml: 2, mt: 1.1, mb: 4 }}>
					<ProfileHeader
						name={props.member.fullName}
						offices={props.member.offices}
						partyPositions={props.member.partyPositions}
						otherPositions={props.member.otherPositions}
						textAlign='left'
					/>
				</Stack>
				<BasicDetails member={props.member} size={props.size} />
			</Stack>
		</>
	);
}
