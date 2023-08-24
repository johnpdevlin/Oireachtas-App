/** @format */

import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(name: string, names: string[], theme: Theme) {
	return {
		fontWeight:
			names.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

type Option = {
	name: string;
	id: string;
};

type MultiSelectProps = {
	width: number;
	label: string;
	options: Option[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
};

export default function MultipleSelect({
	width,
	label,
	options,
	setSelectedOptions,
}: MultiSelectProps) {
	const theme = useTheme();

	const [selectedString, setSelectedString] = useState<string[]>([]);

	const handleChange = (event: SelectChangeEvent<typeof selectedString>) => {
		const {
			target: { name, value },
		} = event;
		setSelectedString(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);
		const selectedOptions = options.filter((option) =>
			value.includes(option.id)
		);
		setSelectedOptions(selectedOptions);
	};

	return (
		<div>
			<FormControl sx={{ m: 1, width: width, backgroundColor: 'whitesmoke' }}>
				<InputLabel id='multiple-name-label'>{label}</InputLabel>
				<Select
					labelId={`${label}-multiple-name-label`}
					id={`${label}-multi-select`}
					multiple
					value={selectedString}
					onChange={handleChange}
					input={<OutlinedInput label={label} />}
					MenuProps={MenuProps}>
					{options.map((option) => (
						<MenuItem
							key={option.id}
							value={option.id}
							style={getStyles(option.name, selectedString, theme)}>
							{option.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
