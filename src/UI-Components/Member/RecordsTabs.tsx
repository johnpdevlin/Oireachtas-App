/** @format */

import { SetStateAction, useState, useEffect } from 'react';
import format from 'date-fns/format';

// COMPONENTS // MUI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Grid } from '@mui/material';

// ICONS // MUI
import RecordVoiceOverSharpIcon from '@mui/icons-material/RecordVoiceOverSharp';
import HowToVoteSharpIcon from '@mui/icons-material/HowToVoteSharp';
import ContactSupportSharpIcon from '@mui/icons-material/ContactSupportSharp';

// INTERNAL UI COMPONENTS
import TdQuestions from './TdQuestions';
import TdVotes from './Votes';

// INTERNAL FETCH / TOOL COMPONENTS
import Calendar from './Calendar';

export default function RecordsTabs(props: {
	minDate: Date;
	maxDate: Date;
	member: string;
}) {
	// TAB EVENTS
	const [selectedTab, setSelectedTab] = useState(() => {
		return 'Votes';
	});

	const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue);
	};

	// CALENDAR EVENTS
	const [selectedDate, setSelectedDate] = useState<Date>(() => {
		// date selected on calendar
		return props.maxDate;
	});

	return (
		<Box sx={{ width: '100%', typography: 'body2' }}>
			<TabContext value={selectedTab}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						p: 2,
						display: 'flex',
						flexDirection: 'column',
					}}>
					<Grid container spacing={10}>
						{/* CALENDAR */}
						<Grid item xs={2} md={2} lg={3}>
							<Calendar
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								minDate={props.minDate}
								maxDate={props.maxDate}
							/>
						</Grid>
						{/* TAB LIST // MENU */}
						<Grid item lg={9}>
							<TabList onChange={handleTabChange} aria-label='Records Tab List'>
								<Tab
									icon={<HowToVoteSharpIcon />}
									iconPosition='start'
									label='Votes'
									value='Votes'
								/>
								<Tab
									icon={<ContactSupportSharpIcon />}
									iconPosition='start'
									label='Questions'
									value='Questions'
								/>
								{/* <Tab
									icon={<RecordVoiceOverSharpIcon />}
									iconPosition='start'
									label='Speeches'
									value='Speeches'
								/> */}
							</TabList>
						</Grid>
					</Grid>
					{/* TAB PANEL FOR VOTES, QUESTIONS, AND CONTRIBUTIONS */}
					<TabPanel value='Votes'>
						<TdVotes selectedDate={selectedDate} member={props.member} />
					</TabPanel>
					<TabPanel value='Questions'>
						<TdQuestions selectedDate={selectedDate} member={props.member} />
					</TabPanel>
					{/* <TabPanel value='Speeches'></TabPanel> */}
				</Box>
			</TabContext>
		</Box>
	);
}
