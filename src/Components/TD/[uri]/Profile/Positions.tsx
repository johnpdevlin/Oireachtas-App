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
import HoverableFootnote from '@/Components/_utils/HoverableFootnote';
import { sortByDateRange } from '../../../../functions/_utils/date_range';

export default function Positions(props: {
	offices?: MemberPageMembership[];
	partyPositions?: MemberPageMembership[];
	otherPositions?: MemberPageMembership[];
}) {
	const formattedSeniorOffices = props.offices
		?.filter((o) => o.type === 'senior' && !o.name.includes('without'))
		.sort((a, b) => sortByDateRange(a, b))
		.map((o, key) => (
			<PositionItem
				title={o.name}
				dateRange={o.dateRange}
				note={''}
				key={key}
				type='senior office'
			/>
		));
	const formattedJuniorOffices = props.offices
		?.filter((o) => o.type === 'junior')
		.sort((a, b) => sortByDateRange(a, b))
		.map((o, key) => (
			<PositionItem
				title={'Minister of State'}
				dateRange={o.dateRange}
				note={o.name}
				key={key}
				type='junior office'
			/>
		));

	const formattedPartyPositions = props.partyPositions
		?.sort((a, b) => sortByDateRange(a, b))
		.map((pp, key) => {
			if (pp.name.includes('with'))
				pp.name = `Joint ${pp.name.split('with')[0]}`;
			return (
				<PositionItem
					title={pp.name}
					dateRange={pp.dateRange}
					note={''}
					key={key}
					type='party'
				/>
			);
		});
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
				<CardContent>
					<Stack rowGap={1.5}>
						{formattedSeniorOffices && (
							<Stack direction='column'>{formattedSeniorOffices}</Stack>
						)}
						{formattedPartyPositions && (
							<Stack direction='column'>{formattedPartyPositions}</Stack>
						)}
						{formattedJuniorOffices && (
							<Stack direction='column'>{formattedJuniorOffices}</Stack>
						)}
						{formattedOtherPositions && (
							<Stack direction='column'>{formattedOtherPositions}</Stack>
						)}
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}

function PositionItem(props: {
	title: string;
	note: string;
	dateRange: DateRangeStr;
	type: 'senior office' | 'junior office' | 'party' | 'other';
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
					<Avatar
						variant='rounded'
						sx={{
							width: '35px',
							height: '35px',
							backgroundColor: '#4dabf5',
						}}>
						{icon()}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={title}
					secondary={`${new Date(start).getFullYear()} - ${
						end! ? new Date(end as string).getFullYear() : 'Present'
					}`}
				/>
				{note! && <HoverableFootnote name={' [note]'} text={note} />}
			</ListItem>
		</>
	);
}
