/** @format */

import ProfileCard from '@/Components/TD/[uri]/Profile/ProfileCard';
import ProfileImage from '@/Components/TD/_utils/ProfileImg';
import Address from '@/Components/_utils/Contact/Address';
import PhoneNumber from '@/Components/_utils/Contact/PhoneNumber';
import SocialIcon from '@/Components/_utils/SocialIcon';
import { MemberBioData } from '@/models/ui/member';
import Email from '@/Components/_utils/Contact/Email';
import {
	Grid,
	CardMedia,
	Card,
	CardContent,
	Stack,
	Typography,
	Divider,
	CardActions,
} from '@mui/material';

type ProfileLayoutProps = {
	bio: MemberBioData;
};

export default function MD_ProfileLayout({
	bio,
}: ProfileLayoutProps): JSX.Element {
	return (
		<>
			<>
				<Grid container>
					<Grid item md={3}>
						<CardMedia sx={{ mb: 0, width: '100%', mt: 2, ml: 1 }}>
							<ProfileImage
								uri={bio.uri}
								name={bio.fullName}
								size={250}
								borderRadius={5}
							/>
						</CardMedia>
					</Grid>
					<Grid item md={6}>
						<ProfileCard member={bio} size={'md'} />
					</Grid>
					<Grid item md={3}>
						<Card sx={{ mt: 2.5, mr: 1 }}>
							<CardContent>
								<Address label={'Constitunecy Address'} address={bio.address} />

								<Stack direction='column' sx={{ mt: 1 }}>
									<Typography variant='body1'>Contact Details </Typography>
									<Divider />
									{bio.contactNumbers.map((num, _) => {
										return <PhoneNumber key={_} number={num} />;
									})}
									<Email email={bio.email} />
								</Stack>
							</CardContent>

							<CardActions sx={{ justifyContent: 'center' }}>
								<Stack
									direction='row'
									sx={{
										mt: 2,
									}}
									spacing={2}>
									{bio.webpages.map((page, _) => (
										<SocialIcon key={_} page={page} color='DarkSlateBlue' />
									))}
								</Stack>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</>
		</>
	);
}
