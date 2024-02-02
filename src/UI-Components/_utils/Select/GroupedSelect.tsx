/** @format */

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function GroupedSelect(props: {
	label: string;
	groupings: {
		category: string;
		groups: { label: string; value: string | number }[];
	}[];
}) {
	const optionGroups = () => {
		return props.groupings.map((groupings) => {
			return (
				<>
					<optgroup label={groupings.category}>
						{groupings.groups.map((group) => {
							return (
								<>
									<option value={group.value}>{group.label}</option>
								</>
							);
						})}
					</optgroup>
				</>
			);
		});
	};

	return (
		<>
			<FormControl sx={{ m: 1, minWidth: 120 }}>
				<InputLabel htmlFor='grouped-native-select'>{props.label}</InputLabel>
				<Select
					native
					defaultValue=''
					id={`grouped-${props.label}-select`}
					label={props.label}>
					{optionGroups()}
				</Select>
			</FormControl>
		</>
	);
}
