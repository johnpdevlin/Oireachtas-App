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

import { MarkunreadMailbox, Call, AlternateEmail } from '@mui/icons-material';
import Image from 'next/image';

import SocialIcons from '../../Util/SocialIcons';
import Address from '@/UI-TEST/Util/Address';
import PhoneNumber from '@/UI-TEST/Util/PhoneNumber';
import Email from '@/UI-TEST/Util/Email';
import ProfileImage from './ProfileImg';

export default function ContactCard() {
	return (
		<Card sx={{ mt: 2.5 }}>
			<CardMedia sx={{ mb: 0, width: '100%' }}>
				<ProfileImage
					uri={'Leo-Varadkar.D.2007-06-14'}
					name={'Leo Varadkar'}
					size={300}
				/>
			</CardMedia>
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
	);
}
