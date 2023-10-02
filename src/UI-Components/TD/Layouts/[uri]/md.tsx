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
import { Email } from '@mui/icons-material';

export default function MediumTDlayout(props: {
	member: unknown;
}): JSX.Element {
	// member: unknown

	return (
		<>
			<>
				<Grid container>
					<Grid item md={3}>
						<CardMedia sx={{ mb: 0, width: '100%', mt: 2, ml: 1 }}>
							<ProfileImage
								uri={'Leo-Varadkar.D.2007-06-14'}
								name={'Leo Varadkar'}
								size={250}
								borderRadius={5}
							/>
						</CardMedia>
					</Grid>
					<Grid item md={6}>
						<ProfileCard member={props.member} />
					</Grid>
					<Grid item md={3}>
						<Card sx={{ mt: 2.5, mr: 1 }}>
							<CardContent>
								<Address
									label='Constitunecy Address'
									address='Unit 1, Old Quarry Campus, Kilshane Park, Northwest Business Park,
					Blanchardstown, Dublin 15, D15 A337'
								/>

								<Stack direction='column' sx={{ mt: 1 }}>
									<Typography variant='body1'>Contact Details </Typography>
									<Divider />
									<PhoneNumber number='(01) 619 4000' />
									<Email email='leo.varadkar@oireachtas.ie' />
								</Stack>
							</CardContent>

							<CardActions>
								<SocialIcons />
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</>
		</>
	);
}
