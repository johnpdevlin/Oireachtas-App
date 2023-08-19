/** @format */
import * as React from 'react';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { CalendarPickerSkeleton } from '@mui/x-date-pickers/CalendarPickerSkeleton';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import format from 'date-fns/esm/fp/format/index.js';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import fetchQuestions from '../../Fetcher/OireachtasAPI/questions';
import { Box, Grid } from '@mui/material';

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
			<Box sx={{ mt: 1.8 }}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DesktopDatePicker
						label=''
						loading={isLoading}
						disableFuture={true}
						orientation='landscape'
						inputFormat='yyyy-MM-dd'
						value={props.selectedDate}
						minDate={props.minDate}
						maxDate={props.maxDate}
						onChange={(newValue) => {
							if (newValue instanceof Date) {
								props.setSelectedDate(newValue);
							}
						}}
						onMonthChange={handleMonthChange}
						renderLoading={() => <CalendarPickerSkeleton />}
						renderInput={(params) => <TextField {...params} />}
						shouldDisableDate={isSitting}
					/>
				</LocalizationProvider>
			</Box>
		</>
	);
}
