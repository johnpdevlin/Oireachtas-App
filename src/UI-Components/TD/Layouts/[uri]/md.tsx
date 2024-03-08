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
import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';
import SocialIcon from '@/UI-Components/_utils/SocialIcon';

export default function MediumTDlayout(props: {
	member: MemberBioData;
}): JSX.Element {
	return (
		<>
			<>
				<Grid container>
					<Grid item md={3}>
						<CardMedia sx={{ mb: 0, width: '100%', mt: 2, ml: 1 }}>
							<ProfileImage
								uri={props.member.uri}
								name={props.member.fullName}
								size={250}
								borderRadius={5}
							/>
						</CardMedia>
					</Grid>
					<Grid item md={6}>
						<ProfileCard member={props.member} size={'md'} />
					</Grid>
					<Grid item md={3}>
						<Card sx={{ mt: 2.5, mr: 1 }}>
							<CardContent>
								<Address
									label={'Constitunecy Address'}
									address={props.member.address}
								/>

								<Stack direction='column' sx={{ mt: 1 }}>
									<Typography variant='body1'>Contact Details </Typography>
									<Divider />
									{props.member.contactNumbers.map((num, _) => {
										return <PhoneNumber key={_} number={num} />;
									})}
									<Email email={props.member.email} />
								</Stack>
							</CardContent>

							<CardActions>
								<Stack direction='row' sx={{ mt: 2 }} spacing={2}>
									{props.member.webpages.map((page, _) => (
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
