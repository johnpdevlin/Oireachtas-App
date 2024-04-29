/** @format */

import BasicDetails from '@/Components/TD/[uri]/Profile/BasicDetails';
import ProfileHeader from '@/Components/TD/[uri]/Profile/ProfileHeader';
import ProfileImage from '@/Components/TD/_utils/ProfileImg';
import { MemberPageBioData } from '@/models/pages/member/member';
import { Box } from '@mui/material';

type ProfileLayoutProps = {
	bio: MemberPageBioData;
};

export default function XS_ProfileLayout({
	bio,
}: ProfileLayoutProps): JSX.Element {
	const { fullName, offices, uri } = bio;

	return (
		<>
			<Box sx={{ mx: 1, textAlign: 'center' }}>
				<ProfileHeader name={fullName} textAlign='center' offices={offices} />

				<ProfileImage uri={uri} name={fullName} size={200} />
				<BasicDetails member={bio} size='xs' />
			</Box>
		</>
	);
}
