/** @format */

import {
	Typography,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	Divider,
	Stack,
} from '@mui/material';

import ProfileImage from '../_utils/ProfileImg';
import Address from '@/UI-Components/_utils/Contact/Address';
import PhoneNumber from '@/UI-Components/_utils/Contact/PhoneNumber';
import Email from '@/UI-Components/_utils/Contact/Email';
import { WebsitePair } from '@/functions/oireachtas_pages/td/profile/td_profile';
import SocialIcon from '@/UI-Components/_utils/SocialIcon';

export default function ContactCard(props: {
	uri: string;
	name: string;
	address: string;
	phoneNumber: string;
	email: string;
	webpages: WebsitePair[];
}) {
	return (
		<Card sx={{ mt: 2.5 }}>
			<CardMedia sx={{ mb: 0, width: '100%' }}>
				<ProfileImage uri={props.uri} name={props.name} size={300} />
			</CardMedia>
			<CardContent>
				<Address label='Constitunecy Address' address={props.address} />

				<Stack direction='column' sx={{ mt: 1 }}>
					<Typography variant='body1'>Contact Details </Typography>
					<Divider />
					<PhoneNumber number={props.phoneNumber} />
					<Email email={props.email} />
				</Stack>
			</CardContent>

			<CardActions>
				<Stack direction='row' sx={{ m: 2 }} spacing={2}>
					{props.webpages.map((page, _) => (
						<SocialIcon key={_} page={page} color={'DarkSlateBlue'} />
					))}
				</Stack>
			</CardActions>
		</Card>
	);
}
