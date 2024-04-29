/** @format */

import {
	Typography,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	Divider,
	Stack,
	Box,
	Grid,
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
			<CardActions
				sx={{ justifyContent: 'space-between', overflowX: 'auto', m: 0.75 }}>
				<Grid container spacing={2} justifyContent='center'>
					{props.webpages.map((page, index) => (
						<Grid item key={index} sx={{ minWidth: '45px' }}>
							<SocialIcon page={page} color={'DarkSlateBlue'} />
						</Grid>
					))}
				</Grid>
			</CardActions>
		</Card>
	);
}
