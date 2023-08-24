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
import HoverableFootnote from '../../../UI-TEST/Util/HoverableFootnote';

function BasicDetails() {
	return (
		<>
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
		</>
	);
}

export default BasicDetails;
