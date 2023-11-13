/** @format */

import { Card, CardContent, Stack } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';

import { DateRangeStr } from '@/models/dates';
import { MemberOffice } from '@/models/oireachtasApi/Formatted/Member/office';

export default function FormerPositions(props: { offices: MemberOffice[] }) {
	const formerOffices = props.offices.filter((o) => o.dateRange.end!);
	console.log(formerOffices);
	const formattedOffices = formerOffices.map((o, key) => {
		return <OfficeItem title={o.name} dateRange={o.dateRange} note={''} />;
	});
	return (
		<>
			<Card>
				<CardContent sx={{ padding: 0 }}>
					<Stack direction='column' paddingX={2} paddingY={1}>
						{formattedOffices}
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}

function OfficeItem(props: {
	title: string;
	note: string;
	dateRange: DateRangeStr;
}) {
	const { title, note, dateRange } = props;
	const { start, end } = dateRange;
	return (
		<>
			<ListItem disablePadding>
				<ListItemAvatar>
					<Avatar variant='rounded' sx={{ width: '35px', height: '35px' }}>
						<WorkIcon fontSize='small' />
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={title}
					secondary={`${new Date(start).getFullYear()} - ${new Date(
						end as string
					).getFullYear()}`}
				/>
			</ListItem>
		</>
	);
}
