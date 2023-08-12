/** @format */
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {
	Facebook,
	Twitter,
	Language,
	Article,
	YouTube,
} from '@mui/icons-material';

import Typography from '@mui/material/Typography';
import mansionHouse from 'src/Images/mansionHouse.jpg';
import Image from 'next/image';
import { Stack } from '@mui/material';

export default function ContactCard() {
	return (
		<Card sx={{ maxWidth: 240 }}>
			<CardMedia sx={{ height: 210 }}>
				<Image src={mansionHouse} alt={'The First Dáil'} height={210} />
			</CardMedia>
			<CardContent>
				<Typography variant='body1'>Constituency Address:</Typography>
				<Typography variant='body2' color='text.secondary'>
					Unit 1, Old Quarry Campus, Kilshane Park, Northwest Business Park,
					Blanchardstown, Dublin 15, D15 A337
				</Typography>
				<Typography variant='body1' sx={{ mt: 1 }}>
					Contact Details:
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					(01) 619 4000
				</Typography>

				<Typography variant='body2' color='text.secondary'>
					leo.varadkar@oireachtas.ie
				</Typography>
			</CardContent>

			<CardActions>
				<Stack direction='row' spacing={1.5}>
					<Language fontSize='large' />
					<Article fontSize='large' />
					<Facebook fontSize='large' />
					<Twitter fontSize='large' />
					<YouTube fontSize='large' />
				</Stack>
			</CardActions>
		</Card>
	);
}
