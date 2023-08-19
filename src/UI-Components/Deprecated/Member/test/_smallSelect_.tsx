/** @format */

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Dispatch, SetStateAction } from 'react';

export default function SelectSmall(
	labels: { name: string; value: string | number }[],
	label: string,
	state: string,
	setState: Dispatch<SetStateAction<string>>
) {
	const handleChange = (event: SelectChangeEvent) => {
		setState(event.target.value);
	};

	return (
		<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
			<InputLabel id={`${label}-small-select`}>Age</InputLabel>
			<Select
				labelId={`${label}-small-select`}
				id={`${label}-small-select`}
				value={state}
				label={label}
				onChange={handleChange}>
				{labels.map((item, index) => (
					<MenuItem key={index} value={item.value}>
						{item.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
