/** @format */

import { Card, CardContent, Stack } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WorkIcon from '@mui/icons-material/Work';
import { DateRangeStr } from '@/models/dates';
import { MemberPageMembership } from '@/models/pages/member/member';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

export default function FormerPositions(props: {
	offices?: MemberPageMembership[];
	partyPositions?: MemberPageMembership[];
	otherPositions?: MemberPageMembership[];
}) {
	const formattedOffices = props.offices?.map((o, key) => (
		<PositionItem
			title={o.name}
			dateRange={o.dateRange}
			note={''}
			key={key}
			type='office'
		/>
	));
	const formattedPartyPositions = props.partyPositions?.map((pp, key) => (
		<PositionItem
			title={pp.name}
			dateRange={pp.dateRange}
			note={''}
			key={key}
			type='party'
		/>
	));
	const formattedOtherPositions = props.otherPositions?.map((op, key) => (
		<PositionItem
			title={op.name}
			dateRange={op.dateRange}
			note={''}
			key={key}
			type='other'
		/>
	));
	return (
		<>
			<Card>
				<CardContent sx={{ padding: 0 }}>
					{formattedOffices && (
						<Stack direction='column' paddingX={2} paddingY={1}>
							{formattedOffices}
						</Stack>
					)}
					{formattedPartyPositions && (
						<Stack direction='column' paddingX={2} paddingY={1}>
							{formattedPartyPositions}
						</Stack>
					)}
					{formattedOtherPositions && (
						<Stack direction='column' paddingX={2} paddingY={1}>
							{formattedOtherPositions}
						</Stack>
					)}
				</CardContent>
			</Card>
		</>
	);
}

function PositionItem(props: {
	title: string;
	note: string;
	dateRange: DateRangeStr;
	type: 'office' | 'party' | 'other';
}) {
	const { title, note, dateRange } = props;
	const { start, end } = dateRange;
	const icon = () => {
		if (props.type === 'party') return <GroupsOutlinedIcon fontSize='small' />;
		else return <WorkIcon fontSize='small' />;
	};
	return (
		<>
			<ListItem disablePadding>
				<ListItemAvatar>
					<Avatar variant='rounded' sx={{ width: '35px', height: '35px' }}>
						{icon()}
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
