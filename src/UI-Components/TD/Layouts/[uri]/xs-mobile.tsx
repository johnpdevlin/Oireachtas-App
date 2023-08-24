/** @format */

import ProfileImage from '../../Components/ProfileImg';
import ProfileHeader from '../../Components/ProfileHeader';
import BasicDetails from '../../Components/BasicDetails';
import { Box } from '@mui/material';

export default function MobileTDlayout(props: {
	member: unknown;
}): JSX.Element {
	// member: unknown

	return (
		<>
			<Box sx={{ mx: 1 }}>
				<ProfileHeader name={props.member.name} textAlign='center' />
				<ProfileImage
					uri={props.member.uri}
					name={props.member.name}
					size={510}
				/>
				<BasicDetails />
			</Box>
		</>
	);
}
