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
import { MarkunreadMailbox, Call, AlternateEmail } from '@mui/icons-material';
import Image from 'next/image';
import { Avatar, CardHeader, Divider, Stack } from '@mui/material';
import { blue, green } from '@mui/material/colors';

export default function ContactCard() {
	return (
		<Card sx={{ maxWidth: 240, mt: 2.5 }}>
			<CardMedia sx={{ height: 210, mb: 3 }}>
				<Image
					src={
						'https://data.oireachtas.ie/ie/oireachtas/member/id/Leo-Varadkar.D.2007-06-14/image/large'
					}
					alt={'Member'}
					height={240}
					width={240}
				/>
			</CardMedia>
			<CardContent>
				<Stack direction='row'>
					<MarkunreadMailbox
						fontSize='small'
						sx={{ textAlign: 'left', mr: 0.5 }}
					/>
					<Typography variant='body1'>Constituency Address </Typography>
				</Stack>
				<Divider />

				<Typography variant='body2' color='text.secondary'>
					Unit 1, Old Quarry Campus, Kilshane Park, Northwest Business Park,
					Blanchardstown, Dublin 15, D15 A337
				</Typography>

				<Stack direction='row' sx={{ mt: 1 }}>
					<Typography variant='body1'>Contact Details </Typography>
				</Stack>
				<Divider />
				<Stack direction='row'>
					<Call fontSize='small' sx={{ textAlign: 'left', mr: 0.5 }} />
					<Typography variant='body2' color='text.secondary'>
						(01) 619 4000
					</Typography>
				</Stack>
				<Stack direction='row'>
					<AlternateEmail
						fontSize='small'
						sx={{ textAlign: 'left', mr: 0.5 }}
					/>
					<Typography variant='body2' color='text.secondary'>
						leo.varadkar@oireachtas.ie
					</Typography>
				</Stack>
			</CardContent>

			<CardActions>
				<Stack direction='row' spacing={1.5}>
					<Language fontSize='large' />

					<Facebook fontSize='large' />
					<Twitter fontSize='large' />
					<YouTube fontSize='large' />
					<Image
						src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/256px-Wikipedia%27s_W.svg.png?20220824035851'
						width={'35'}
						height={'35'}
						style={{}}
						alt='wikipedia'
					/>
				</Stack>
			</CardActions>
		</Card>
	);
}
