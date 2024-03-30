/** @format */

import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Divider,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import ProfileImage from '../../_utils/ProfileImg';
import ProfileCard from '../../[uri]/ProfileCard';
import Address from '@/UI-Components/_utils/Contact/Address';
import PhoneNumber from '@/UI-Components/_utils/Contact/PhoneNumber';
import Email from '@/UI-Components/_utils/Contact/Email';

import SocialIcon from '@/UI-Components/_utils/SocialIcon';
import { MemberBioData } from '@/models/ui/member';

export default function MediumTDlayout(props: {
	bio: MemberBioData;
}): JSX.Element {
	return (
		<>
			<>
				<Grid container>
					<Grid item md={3}>
						<CardMedia sx={{ mb: 0, width: '100%', mt: 2, ml: 1 }}>
							<ProfileImage
								uri={props.bio.uri}
								name={props.bio.fullName}
								size={250}
								borderRadius={5}
							/>
						</CardMedia>
					</Grid>
					<Grid item md={6}>
						<ProfileCard member={props.bio} size={'md'} />
					</Grid>
					<Grid item md={3}>
						<Card sx={{ mt: 2.5, mr: 1 }}>
							<CardContent>
								<Address
									label={'Constitunecy Address'}
									address={props.bio.address}
								/>

								<Stack direction='column' sx={{ mt: 1 }}>
									<Typography variant='body1'>Contact Details </Typography>
									<Divider />
									{props.bio.contactNumbers.map((num, _) => {
										return <PhoneNumber key={_} number={num} />;
									})}
									<Email email={props.bio.email} />
								</Stack>
							</CardContent>

							<CardActions>
								<Stack direction='row' sx={{ mt: 2 }} spacing={2}>
									{props.bio.webpages.map((page, _) => (
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
