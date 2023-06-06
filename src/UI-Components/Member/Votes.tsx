/** @format */

import * as React from 'react';
import { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { autocompleteClasses, selectClasses } from '@mui/material';

import StyleOutcome from '../../Components/Tools/Styling/StyleOutcome';

// INTERNAL TOOLS
import fetchVotes from '../../Fetcher/OireachtasAPI/votes';
import { format } from 'date-fns';
import { Vote } from '../../Models/UI/participation';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A3027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	minHeight: '100%',
	color: theme.palette.text.secondary,
}));

export default function TdVotes(props: { member: string; selectedDate: Date }) {
	const [votes, setVotes] = useState<Vote[]>([]); // questions on date selected

	const handleCalendarChange = async () => {
		// fetches votes and sets them to selected date
		const date = props.selectedDate;
		const theseVotes = await fetchVotes({
			date: date,
			member: props.member,
		});
		setVotes(theseVotes);
	};

	useEffect(() => {
		// When user changes date, triggers fetching of votes
		{
			props.selectedDate !== null ? handleCalendarChange() : null;
		}
	}, [props.selectedDate]);

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={1} mb={4}>
					{votes?.map((v, index) => {
						return (
							<>
								<Grid item xs={6.6} md={6.6} lg={8}>
									<Item>
										<h5>{v.committee}</h5>
										<h4>{v.debate}</h4>
										<h3>{v.subject}</h3>
									</Item>
								</Grid>
								<Grid item xs={2.1} md={2.0} lg={1.8}>
									<Item>
										<small>Voted:</small>
										{StyleOutcome(v.voted!)}
									</Item>
								</Grid>
								<Grid item xs={3.3} md={3.4} lg={2.2}>
									<Item>
										<small>Outcome:</small>
										{StyleOutcome(v.outcome)}
										<h6 style={{ fontStyle: 'italic' }}>
											<span style={{ color: 'green' }}>{v.tallies.yes}</span> /{' '}
											<span style={{ color: 'red' }}>{v.tallies.no}</span> /{' '}
											<span style={{ color: 'orange' }}>
												{v.tallies.abstained}
											</span>
										</h6>
									</Item>
								</Grid>
							</>
						);
					})}
				</Grid>
			</Box>
		</>
	);
}
