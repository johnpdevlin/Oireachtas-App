/** @format */
import * as React from 'react';

import Typography from '@mui/material/Typography';

import { Stack, Table, TableBody, TableCell, TableRow } from '@mui/material';
import {
	Cake,
	HistoryEdu,
	School,
	HowToVote,
	Place,
	HourglassEmpty,
} from '@mui/icons-material';
import { Member } from '../../../Models/UI/member';
import ContactCard from './_contactCard';
import HoverableFootnote from './_hoverableFootnote';

type ProfileCardProps = {
	member: Member;
};

function ProfileCard() {
	return (
		<Stack direction='row' sx={{ ml: 4 }}>
			<ContactCard />
			{/* <Stack direction='column' sx={{ mt: 1.5 }}>
				<Image
					src='https://data.oireachtas.ie/ie/oireachtas/member/id/Leo-Varadkar.D.2007-06-14/image/large'
					width={250}
					height={250}
					style={{ marginLeft: '5%' }}
					alt='Picture of the author'
				/>
			</Stack> */}

			<Stack direction='column' sx={{ ml: 3, mr: 4 }}>
				<Stack direction='column' sx={{ ml: 1.8, mt: 1, mb: 4 }}>
					<Typography variant='h2' sx={{ whiteSpace: 'nowrap' }}>
						Leo Varadkar
					</Typography>
					<Typography variant='h6' alignContent={'justify'}>
						Taoiseach, Minister for Enterprise, Trade and Employment, Leader of
						Fine Gael
					</Typography>
				</Stack>
				<Table size='small'>
					<TableBody>
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<Cake fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Born:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>18 January 1979</b> (age 44)
									<br />
									<small>
										<i>Dublin, Ireland</i>
									</small>
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<HistoryEdu fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Education:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>The King's Hospital </b>

									<small>
										<i>(private)</i>
									</small>
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<School fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Alma Mater:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>Trinity College</b>
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<HowToVote fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Party:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>Fine Gael</b>
									<small>[1]</small>
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<Place fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Constituency:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>Dublin West </b>

									<HoverableFootnote
										name='[1]'
										text='Formerly Baden-Baden (2020-2022)'
									/>
								</Typography>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<HourglassEmpty fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Duration in Oireachtas:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b>1 year, 2 months</b>
								</Typography>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Stack>
		</Stack>
	);
}

export default ProfileCard;
