/** @format */

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Dispatch, SetStateAction } from 'react';

type SelectProps = {
	label: string;
	groupings: {
		category: string;
		groups: { label: string; value: string | number }[];
	}[];
	value: number | string;
	setValue: Dispatch<SetStateAction<string>>;
	overall?: string;
};

export default function GroupedSelect({
	label,
	groupings,
	value,
	setValue,
	overall,
}: SelectProps) {
	const optionGroups = () => {
		return (
			<>
				{overall && (
					<option key={'overall'} value={'0'}>
						{overall}
					</option>
				)}{' '}
				&&
				{groupings.map((group) => {
					return (
						<optgroup key={group.category} label={group.category}>
							{group.groups.map((grp) => (
								<option key={grp.value} value={grp.value}>
									{grp.label}
								</option>
							))}
						</optgroup>
					);
				})}
			</>
		);
	};

	return (
		<FormControl sx={{ m: 1, minWidth: 120 }}>
			<InputLabel htmlFor={`grouped-${label}-select`}>{label}</InputLabel>
			<Select
				native
				value={value}
				onChange={(e) => setValue(e.target.value as string)} // Cast to string
				id={`grouped-${label}-select`}
				label={label}>
				{optionGroups()}
			</Select>
		</FormControl>
	);
}
