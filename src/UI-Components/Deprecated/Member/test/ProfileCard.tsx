/** @format */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { Stack } from '@mui/material';
import ProfileTable from './ProfileTable';
import ProfileIcons from './ProfileIcons';
import { Member } from '../../../Models/UI/member';

type ProfileCardProps = {
	member: Member;
};

function ProfileCard({ member }: ProfileCardProps) {
	return (
		<Card sx={{ display: 'flex', mb: 4 }}>
			<Stack direction='row' sx={{ mt: 4 }}>
				<CardMedia sx={{ mt: 1, mx: 5 }}>
					<Stack direction='column'>
						<img
							width={170}
							height={170}
							style={{
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
								borderTopRightRadius: 5,
								borderTopLeftRadius: 5,
								overflow: 'hidden',
							}}
							src='https://data.oireachtas.ie/ie/oireachtas/member/id/Leo-Varadkar.D.2007-06-14/image/large'
						/>
						<ProfileIcons />
					</Stack>
				</CardMedia>
				<Stack direction='column'>
					<Typography variant='h2' sx={{ mx: 3 }}>
						Leo Varadkar
					</Typography>
					<CardContent>
						<ProfileTable />
					</CardContent>
				</Stack>
			</Stack>
		</Card>
	);
}

export default ProfileCard;
