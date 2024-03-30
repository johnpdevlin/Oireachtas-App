/** @format */

import { Box } from '@mui/material';
import ProfileHeader from '../../[uri]/ProfileHeader';
import ProfileImage from '../../_utils/ProfileImg';
import BasicDetails from '../../[uri]/BasicDetails';
import { MemberBioData } from '@/models/ui/member';

export default function MobileTDlayout(props: {
	bio: MemberBioData;
}): JSX.Element {
	const { fullName, offices, uri } = props.bio;
	return (
		<>
			<Box sx={{ mx: 1 }}>
				<ProfileHeader name={fullName} textAlign='center' offices={offices} />
				<ProfileImage uri={uri} name={fullName} size={510} />
				<BasicDetails member={props.bio} size='xs' />
			</Box>
		</>
	);
}
