/** @format */

// import { useState } from 'react';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';

// interface betweenDates {
// 	startDate: Date;
// 	endDate: Date;
// }

// interface record {
// 	currentDail: betweenDates;
// 	currentYear: betweenDates;
// }

// export default function DropDownSelect() {
// 	const currentYr = new Date().getFullYear();

// 	const currentYear: betweenDates = {
// 		startDate: new Date(currentYr, 1, 1),
// 		endDate: new Date(Date.now()),
// 	};

// 	const currentDail: betweenDates = {
// 		startDate: new Date(2020, 1, 1),
// 		endDate: new Date(Date.now()),
// 	};

// 	const [timePeriod, setTimePeriod] = useState<betweenDates>(currentDail);

// 	const handleChange = (event: SelectChangeEvent) => {
// 		setTimePeriod(event.target.value.toString());
// 	};

// 	return (
// 		<div>
// 			<FormControl
// 				sx={{
// 					maxHeight: '10px',
// 				}}>
// 				<Select
// 					labelId='Drop down select menu for time period'
// 					id='Drop down select menu for time period'
// 					sx={{
// 						backgroundColor: '#dedad1',
// 					}}
// 					renderValue={(selected) => {
// 						return selected;
// 					}}
// 					value={timePeriod}
// 					onChange={handleChange}
// 					autoWidth
// 					label='Time Period'>
// 					<MenuItem value={currentDail}>
// 						<em>Current Dáil</em>
// 					</MenuItem>
// 					<MenuItem
// 						value={currentYear}
// 						onClick={setTimePeriod(() => currentYear)}>
// 						Current Year
// 					</MenuItem>
// 					<MenuItem value={sinceElected}>Since Elected</MenuItem>
// 				</Select>
// 			</FormControl>
// 		</div>
// 	);
// }

export default null;
