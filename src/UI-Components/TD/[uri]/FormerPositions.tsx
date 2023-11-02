/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Typography,
	Stack,
} from '@mui/material';
import { Work, AccountBalance } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';

import { DateRange, DateRangeObj, DateRangeStr } from '@/models/dates';

export default function FormerPositions() {
	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardContent sx={{ padding: 0 }}>
					<PeriodList />
				</CardContent>
			</Card>
		</>
	);
}

function PeriodList({}) {
	const dateRange: DateRangeStr = {
		start: '2015-01-01',
		end: '2017-01-01',
	};
	return (
		<>
			<Stack direction='column' paddingX={2} paddingY={1}>
				<PeriodItem
					title='Minster for Heat'
					note='Also...'
					dateRange={dateRange}
				/>
				<PeriodItem
					title='Minster for Health'
					note='Also...'
					dateRange={dateRange}
				/>
			</Stack>
		</>
	);
}

function PeriodItem(props: {
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
				<ListItemText primary={title} secondary={`${start} - ${end}`} />
			</ListItem>
		</>
	);
}
