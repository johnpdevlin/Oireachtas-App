/** @format */

import {
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Chart from 'react-google-charts';
import { NavigateNextSharp, NavigateBeforeSharp } from '@mui/icons-material';
import React from 'react';
import { isLargestNumber, isSmallestNumber } from '@/Functions/_util/numbers';

// differentiate time periods, committee vs dail
// flexible layout // month to Q1, Q2 etc.

// PROPS/CONTEXT: data : {member}
export default function LineChart(): JSX.Element {
	const [period, setPeriod] = useState<number>(0);
	const periodOptions = [2020, 2021, 2022, 2023];

	const data = [
		['Period', 'Member', 'Dáil', 'Party', 'Constituency'],
		['Jan 2020', 95, 96, 92, 88],
		['Feb 2020', 95, 91, 92, 91],
		['Mar 2020', 95, 90, 92, 91],
		['Apr 2020', 95, 93, 92, 91],
		['May 2020', 95, 97, 92, 91],
		['Jun 2020', 95, 98, 92, 91],
		['Jul 2020', 95, 99, 92, 91],
		['Aug 2020', 95, 100, 92, 91],
		['Sep 2020', 95, 100, 92, 91],
		['Oct 2020', 95, 100, 92, 91],
		['Nov 2020', 91, 87, 83, 81],
		['Dec 2020', 95, 100, 92, 91],
	];

	const options = {
		hAxis: {},
		vAxis: {
			title: '% Attended',
		},
		series: {
			1: { curveType: 'line' },
		},
		legend: { position: 'bottom' },
	};

	return (
		<>
			<br />
			<SelectPeriod
				options={periodOptions}
				period={period}
				setPeriod={setPeriod}
			/>

			<Grid
				container
				direction={'row'}
				justifyContent='center'
				alignItems='center'>
				{period !== 0 && !isSmallestNumber(period, periodOptions) && (
					<Grid item>
						<NavigateBeforeSharp fontSize='large' />
					</Grid>
				)}
				<Grid item maxWidth={'100%'} minWidth={'90%'}>
					<Chart
						chartType='LineChart'
						width='100%'
						height='400px'
						data={data}
						options={options}
					/>
				</Grid>
				{period !== 0 && !isLargestNumber(period, periodOptions) && (
					<Grid item>
						<NavigateNextSharp fontSize='large' />
					</Grid>
				)}
			</Grid>
		</>
	);
}

function SelectPeriod(props: {
	options: number[];
	period: number;
	setPeriod: Dispatch<SetStateAction<number>>;
}): JSX.Element {
	const options = props.options;
	const period = props.period;
	const setPeriod = props.setPeriod;

	const handleChange = (event: SelectChangeEvent): void => {
		if (event.target.value === '0') setPeriod(0);
		else setPeriod(parseInt(event.target.value));
	};

	return (
		<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
			<InputLabel id='demo-select-small-label'>Age</InputLabel>
			<Select
				labelId='Period-Selector'
				id='Period-Selector'
				value={period.toString()}
				label='Period'
				onChange={handleChange}>
				<MenuItem value='0'>
					<em>Overall</em>
				</MenuItem>
				{options.map(
					(
						option: number // Use options.map directly
					) => (
						<MenuItem key={option.toString()} value={option.toString()}>
							{option.toString()}
						</MenuItem>
					)
				)}
			</Select>
		</FormControl>
	);
}
