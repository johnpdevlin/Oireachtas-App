/** @format */

import { Box } from '@mui/material';
import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';
import ProfileHeader from '../../[uri]/ProfileHeader';
import ProfileImage from '../../_utils/ProfileImg';
import BasicDetails from '../../[uri]/BasicDetails';

export default function MobileTDlayout(props: {
	member: MemberBioData;
}): JSX.Element {
	return (
		<>
			<Box sx={{ mx: 1 }}>
				<ProfileHeader
					name={props.member.fullName}
					textAlign='center'
					offices={props.member.offices}
				/>
				<ProfileImage
					uri={props.member.uri}
					name={props.member.fullName}
					size={510}
				/>
				<BasicDetails member={props.member} size='xs' />
			</Box>
		</>
	);
}
