/** @format */

import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import ProfileImage from '../Components/ProfileImg';
import ProfileHeader from '../Components/ProfileHeader';
import BasicDetails from '../Components/BasicDetails';
import SocialIcons from '@/UI-TEST/Util/SocialIcons';
import Address from '@/UI-TEST/Util/Address';
import PhoneNumber from '@/UI-TEST/Util/PhoneNumber';
import Email from '@/UI-TEST/Util/Email';

export default function SmallTDlayout(props: { member: unknown }): JSX.Element {
	// member: unknown

	return (
		<>
			<Box sx={{ mx: 1 }}>
				<ProfileHeader name={props.member.name} textAlign='justify' />
				<Divider />
				<Grid
					container
					direction='row'
					alignItems='left'
					spacing={0.1}
					sx={{ mt: 1.5, mb: 3 }}>
					<Grid
						item
						sm={3.5}
						sx={{ minHeight: '95%', maxHeight: '100%', mt: 1 }}>
						<ProfileImage
							uri={props.member.uri}
							name={props.member.name}
							size={180}
							borderRadius={5}
						/>
					</Grid>
					<Grid item sm={8.5}>
						<BasicDetails />
					</Grid>
				</Grid>

				<Grid container direction='row' alignItems='left' spacing={4}>
					<Grid item sm={4.25}>
						<Address
							label='Constiuency Address'
							address='Unit 1, Old Quarry Campus, Kilshane Park, Northwest Business Park,
					Blanchardstown, Dublin 15, D15 A337'
						/>
					</Grid>
					<Grid item sm={4.25}>
						<Box sx={{ minWidth: '100%' }}>
							<Typography variant='body1'>Contact Details </Typography>
							<Divider />
							<PhoneNumber number='(01) 619 4000' />
							<Email email='leo.varadkar@oireachtas.ie' />
						</Box>
					</Grid>
					<Grid item sm={3.5}>
						<Typography variant='body1'>Online Presence </Typography>
						<Divider sx={{ mb: 1 }} />
						<SocialIcons />
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
