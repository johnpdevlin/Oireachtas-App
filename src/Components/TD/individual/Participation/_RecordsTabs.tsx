/** @format */
import { useState } from 'react';
import { Box, Tab, Grid } from '@mui/material';
import HowToVoteSharpIcon from '@mui/icons-material/HowToVoteSharp';
import ContactSupportSharpIcon from '@mui/icons-material/ContactSupportSharp';
import Calendar from '@/Components/TD/individual/Participation/Calendar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import VotesComp from '@/Components/TD/individual/Participation/Votes';
import QuestionsComp from '@/Components/TD/individual/Participation/Questions';

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
		<TabContext value={selectedTab}>
			<Box
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column',
				}}>
				<Grid container>
					{/* CALENDAR */}
					<Grid item xs={4} sm={4} md={3.5} lg={3.2} xl={4} mt={2}>
						<Calendar
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
							minDate={props.minDate}
							maxDate={props.maxDate}
						/>
					</Grid>
					{/* TAB LIST // MENU */}
					<Grid item xs={7} sm={7} md={7} lg={8}>
						<TabList onChange={handleTabChange} aria-label='Records Tab List'>
							<Tab
								icon={<HowToVoteSharpIcon />}
								iconPosition='start'
								label='Votes'
								value='Votes'
								sx={{ paddingRight: 10 }}
							/>
							<Tab
								icon={<ContactSupportSharpIcon />}
								iconPosition='start'
								label='Questions'
								value='Questions'
								sx={{ paddingRight: 10 }}
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
					<VotesComp selectedDate={selectedDate} member={props.member} />
				</TabPanel>
				<TabPanel value='Questions'>
					<QuestionsComp selectedDate={selectedDate} member={props.member} />
				</TabPanel>
				{/* <TabPanel value='Speeches'></TabPanel> */}
			</Box>
		</TabContext>
	);
}
