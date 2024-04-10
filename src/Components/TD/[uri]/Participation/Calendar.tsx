/** @format */
import * as React from 'react';
import TextField, {
	FilledTextFieldProps,
	OutlinedTextFieldProps,
	StandardTextFieldProps,
	TextFieldVariants,
} from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState, SetStateAction, Dispatch } from 'react';
import { Box } from '@mui/material';

export default function Calendar(props: {
	setSelectedDate: Dispatch<SetStateAction<Date>>;
	selectedDate: Date;
	minDate: Date;
	maxDate: Date;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const handleMonthChange = (date: Date) => {
		setIsLoading(true);
		setIsLoading(false);
	};

	const isSitting = (date: Date) => {
		const day = date.getDay();
		return day === 0 || day === 1 || day === 5 || day === 6 || day === 7;
	};

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DesktopDatePicker
					label=''
					loading={isLoading}
					disableFuture={true}
					orientation='landscape'
					value={props.selectedDate}
					minDate={props.minDate}
					maxDate={props.maxDate}
					onChange={(newValue) => {
						if (newValue instanceof Date) {
							props.setSelectedDate(newValue);
						}
					}}
					onMonthChange={handleMonthChange}
					shouldDisableDate={isSitting}
				/>
			</LocalizationProvider>
		</>
	);
}
