/** @format */

import BasicDetails from '@/Components/TD/[uri]/Profile/BasicDetails';
import ProfileHeader from '@/Components/TD/[uri]/Profile/ProfileHeader';
import ProfileImage from '@/Components/TD/_utils/ProfileImg';
import Address from '@/Components/_utils/Contact/Address';
import PhoneNumber from '@/Components/_utils/Contact/PhoneNumber';
import SocialIcon from '@/Components/_utils/SocialIcon';
import Email from '@/Components/_utils/Contact/Email';
import { MemberBioData } from '@/models/ui/member';
import { Box, Divider, Grid, Typography, Stack } from '@mui/material';

type ProfileLayoutProps = {
	bio: MemberBioData;
};

export default function SM_ProfileLayout({
	bio,
}: ProfileLayoutProps): JSX.Element {
	return (
		<>
			{' '}
			<Box sx={{ mx: 1 }}>
				<ProfileHeader
					name={bio.fullName}
					textAlign='justify'
					offices={bio.offices}
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
							uri={bio.uri}
							name={bio.fullName}
							size={180}
							borderRadius={5}
						/>
					</Grid>
					<Grid item sm={8.5}>
						<BasicDetails member={bio} size='sm' />
					</Grid>
				</Grid>

				<Grid container direction='row' alignItems='left' spacing={4}>
					<Grid item sm={4.25}>
						<Address label='Constiuency Address' address={bio.address} />
					</Grid>
					<Grid item sm={4.25}>
						<Box sx={{ minWidth: '100%' }}>
							<Typography variant='body1'>Contact Details </Typography>
							<Divider />
							{bio.contactNumbers.map((num, index) => {
								return (
									<div key={index}>
										<PhoneNumber number={num} />
									</div>
								);
							})}
							<Email email={bio.email} />
						</Box>
					</Grid>
					<Grid item sm={3.5}>
						<Typography variant='body1'>Online Presence </Typography>
						<Divider sx={{ mb: 1 }} />
						<Stack direction='row' sx={{ mt: 2 }} spacing={2}>
							{bio.webpages.map((page, _) => (
								<SocialIcon key={_} page={page} color='DarkSlateBlue' />
							))}
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
