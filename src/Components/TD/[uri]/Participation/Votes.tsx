/** @format */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import fetchVotes from '@/functions/APIs/Oireachtas/vote/_index';
import { RawVote } from '@/models/oireachtasApi/vote';
import { dateToYMDstring } from '../../../../functions/_utils/dates';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A3027' : '#F0F4F8',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	minHeight: '100%',
	color: theme.palette.text.secondary,
}));

export default function VotesComp(props: {
	member: string;
	selectedDate: Date;
}) {
	const [votes, setVotes] = useState<RawVote[]>([]); // questions on date selected

	const handleCalendarChange = async () => {
		// fetches votes and sets them to selected date
		const date = props.selectedDate;
		const theseVotes = (await fetchVotes({
			date_start: dateToYMDstring(date),
			date_end: dateToYMDstring(date),
			member_id: props.member,
		})) as RawVote[];
		console.log(theseVotes);
		setVotes(theseVotes);
	};

	useEffect(() => {
		// When user changes date, triggers fetching of votes
		{
			props.selectedDate !== null ? handleCalendarChange() : null;
		}
		console.info(props.selectedDate);
	}, [props.selectedDate]);

	const styleVote = (vote: string) => {
		let color = '';
		if (vote === 'Tá' || vote === 'Carried') color = '#2e7d32';
		else color = '#d32f2f';

		return <span style={{ color: color }}> {vote}</span>;
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={1} mb={4}>
					{votes?.map((v, index) => {
						return (
							<>
								<Grid item xs={12} key={index}>
									<Grid container rowSpacing={1} columnSpacing={1} mb={5}>
										<Grid item xs={12} sm={12} md={6.6} lg={8}>
											<Item>
												<Typography variant='subtitle1'>
													{v.chamber.showAs}
												</Typography>
												{v.house.chamberType === 'committee' && (
													<Typography variant='h5'>
														{v.house.committeeCode}
													</Typography>
												)}

												<Typography variant='h6' color={'secondary'}>
													{v.debate.showAs}
												</Typography>
												<Typography variant='subtitle2'>
													{v.subject.showAs}
												</Typography>
											</Item>
										</Grid>
										<Grid item xs={4} sm={4} md={2.0} lg={1.8}>
											<Item>
												<Typography variant='subtitle2'>Voted:</Typography>
												<Typography variant='h3'>
													{styleVote(v.memberTally!.showAs as string)}
												</Typography>
											</Item>
										</Grid>
										<Grid item xs={8} sm={8} md={3.4} lg={2.2}>
											<Item>
												<Typography variant='subtitle2'>Outcome:</Typography>
												<Typography variant='h3'>
													{styleVote(v.outcome)}
												</Typography>
												<Typography variant='caption' fontStyle='italic'>
													<span style={{ color: '#4caf50' }}>
														{v.tallies.taVotes.tally}
													</span>{' '}
													/{' '}
													<span style={{ color: '#ef5350' }}>
														{v.tallies.nilVotes.tally}
													</span>{' '}
													/{' '}
													<span style={{ color: '#ff9800' }}>
														{v.tallies.staonVotes.tally}
													</span>
												</Typography>
											</Item>
										</Grid>
									</Grid>
								</Grid>
							</>
						);
					})}
				</Grid>
			</Box>
		</>
	);
}
