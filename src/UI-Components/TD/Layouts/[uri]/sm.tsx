/** @format */

import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import ProfileHeader from '../../[uri]/ProfileHeader';
import ProfileImage from '../../_utils/ProfileImg';
import BasicDetails from '../../[uri]/BasicDetails';
import Address from '@/UI-Components/_utils/Contact/Address';
import PhoneNumber from '@/UI-Components/_utils/Contact/PhoneNumber';
import SocialIcons from '@/UI-Components/_utils/SocialIcon';
import Email from '@/UI-Components/_utils/Contact/Email';
import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';
import SocialIcon from '@/UI-Components/_utils/SocialIcon';

export default function SmallTDlayout(props: {
	member: MemberBioData;
}): JSX.Element {
	return (
		<>
			<Box sx={{ mx: 1 }}>
				<ProfileHeader
					name={props.member.fullName}
					textAlign='justify'
					offices={props.member.offices}
				/>
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
							name={props.member.fullName}
							size={180}
							borderRadius={5}
						/>
					</Grid>
					<Grid item sm={8.5}>
						<BasicDetails member={props.member} size='sm' />
					</Grid>
				</Grid>

				<Grid container direction='row' alignItems='left' spacing={4}>
					<Grid item sm={4.25}>
						<Address
							label='Constiuency Address'
							address={props.member.address}
						/>
					</Grid>
					<Grid item sm={4.25}>
						<Box sx={{ minWidth: '100%' }}>
							<Typography variant='body1'>Contact Details </Typography>
							<Divider />
							{props.member.contactNumbers.map((num, index) => {
								return (
									<div key={index}>
										<PhoneNumber number={num} />
									</div>
								);
							})}
							<Email email={props.member.email} />
						</Box>
					</Grid>
					<Grid item sm={3.5}>
						<Typography variant='body1'>Online Presence </Typography>
						<Divider sx={{ mb: 1 }} />
						<Stack direction='row' sx={{ mt: 2 }} spacing={2}>
							{props.member.webpages.map((page, _) => (
								<SocialIcon key={_} page={page} color='DarkSlateBlue' />
							))}
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
