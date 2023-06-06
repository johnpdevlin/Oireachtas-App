/** @format */

import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { Grid, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Calendar from './Calendar';

export default function ContributionTabs() {
	const theme = useTheme();

	const Tab = styled(TabUnstyled)`
		color: #fff;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		background-color: transparent;
		width: 100%;
		padding: 10px 12px;
		margin: 11px 8px;
		border: none;
		border-radius: 10px;
		display: flex;
		justify-content: center;

		&:hover {
			background-color: ${theme.palette.secondary.main};
		}

		&:focus {
			color: #fff;
			outline: 2px solid ${theme.palette.secondary.main};
		}

		&.${tabUnstyledClasses.selected} {
			background-color: #fff;
			color: #02577a;
		}

		&.${buttonUnstyledClasses.disabled} {
			opacity: 0.5;
			cursor: not-allowed;
		}
	`;

	const TabPanel = styled(TabPanelUnstyled)(
		({ theme }) => `
  width: 100%;
  font-size: 0.875rem;
  padding: 20px 20px;
  background: #fff;
  border: 1.5px solid ${theme.palette.primary.main};
  border-radius: 12px;
  opacity: 0.6;
  box-shadow: grey 1px 1px 1px 1px;
  `
	);

	const TabsList = styled(TabsListUnstyled)(
		({ theme }) => `
  min-width: 400px;
  background-color: ${theme.palette.warning.main};
  border: 2px solid ${theme.palette.info.main};
  border-radius: 12px;
  padding: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: grey 1px 1px 1px 1px;
  `
	);

	return (
		<TabsUnstyled defaultValue={0}>
			<Stack direction='row' gap={1} sx={{ mb: 3 }}>
				<Stack>
					<Calendar
						setSelectedDate={function (
							value: React.SetStateAction<Date>
						): void {
							throw new Error('Function not implemented.');
						}}
						selectedDate={undefined}
						minDate={undefined}
						maxDate={undefined}
					/>
				</Stack>
				<Stack>
					<TabsList>
						<Tab>Votes</Tab>
						<Tab>Questions</Tab>
						<Tab>Speeches</Tab>
					</TabsList>
				</Stack>
			</Stack>
			<TabPanel value={0}>My account page</TabPanel>
			<TabPanel value={1}>Profile page</TabPanel>
			<TabPanel value={2}>Language page</TabPanel>
		</TabsUnstyled>
	);
}
