/** @format */

import {
	Card,
	CardHeader,
	CardContent,
	Avatar,
	Typography,
	Stack,
} from '@mui/material';
import {
	CropSquare,
	CropSquareRounded,
	Groups,
	Square,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { MemberCommittee } from '@/models/scraped/oireachtas/member';

export default function CommitteesCard(props: {
	committees: {
		current?: MemberCommittee[];
		past?: MemberCommittee[];
	};
}) {
	const committees: MemberCommittee[] = [];
	props.committees.current! && committees.push(...props.committees.current);
	props.committees.past! && committees.push(...props.committees.past);
	const formattedCommittees = committees.map((committee: MemberCommittee) => {
		return (
			<>
				<Stack direction='row' gap={1}>
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
			</>
		);
	});
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
					<Stack direction='column'>{formattedCommittees}</Stack>
				</CardContent>
			</Card>
		</>
	);
}
