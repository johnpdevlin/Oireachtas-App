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

import ProfileImage from '../../_utils/ProfileImg';
import Address from '@/Components/_utils/Contact/Address';
import PhoneNumber from '@/Components/_utils/Contact/PhoneNumber';
import Email from '@/Components/_utils/Contact/Email';
import SocialIcon from '@/Components/_utils/SocialIcon';
import { WebsitePair } from '@/models/_utils';

export default function ContactCard(props: {
	uri: string;
	name: string;
	address: string;
	phoneNumber: string;
	email: string;
	webpages: WebsitePair[];
}) {
	console.info(props.webpages);
	return (
		<Card sx={{ mt: 2.5 }}>
			<CardMedia sx={{ mb: 0, width: '100%' }}>
				<ProfileImage uri={props.uri} name={props.name} size={300} />
			</CardMedia>
			<CardContent>
				<Address label='Constitunecy Address' address={props.address} />

				<Stack direction='column' mt={1}>
					<Typography variant='body1'>Contact Details </Typography>
					<Divider />

					<PhoneNumber number={props.phoneNumber} />
					<Email email={props.email} />
				</Stack>
			</CardContent>

			<CardActions sx={{ justifyContent: 'center' }}>
				<Stack direction='row' sx={{ m: 2 }} spacing={2} textAlign='center'>
					{props.webpages.map((page, _) => (
						<SocialIcon key={_} page={page} color={'DarkSlateBlue'} />
					))}
				</Stack>
			</CardActions>
		</Card>
	);
}
