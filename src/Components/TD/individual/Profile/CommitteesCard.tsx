/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Avatar,
	Typography,
	Stack,
} from '@mui/material';
import { CropSquareRounded, Groups } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { MemberPageMembership } from '@/models/pages/member/member';

export default function CommitteesCard(props: {
	committees: {
		current?: MemberPageMembership[];
		past?: MemberPageMembership[];
	};
}) {
	const formattedCommittees = props.committees.current?.map((com) =>
		formatCommittee(com)
	);
	const formattedPastCommittees = props.committees.past?.map((com) =>
		formatCommittee(com)
	);
	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label='committees icon'>
							<Groups />
						</Avatar>
					}
					title={<Typography variant='h6'>Committees</Typography>}
				/>

				<CardContent sx={{ paddingTop: 0 }}>
					<Stack direction='column'>
						{formattedCommittees ?? ''}
						{formattedPastCommittees ?? ''}
					</Stack>
				</CardContent>
			</Card>
		</>
	);
}

function formatCommittee(committee: MemberPageMembership) {
	const key = committee.name; // You can use committee.name as the key
	return (
		<Stack direction='row' gap={1} key={key}>
			<CropSquareRounded fontSize='small' />
			<Typography variant='body2' color='text.secondary'>
				{committee.name}
				<small>
					<i>
						{committee.dateRange.end !== undefined &&
							committee.dateRange.end !== null &&
							` (${new Date(
								committee.dateRange.start
							).getFullYear()}-${new Date(
								committee.dateRange.end as unknown as string
							).getFullYear()})`}
					</i>
				</small>
			</Typography>
		</Stack>
	);
}
