/** @format */

import { Grid, Stack } from '@mui/material';
import ContactCard from '../../[uri]/ContactCard';
import MemberMenu from '../../[uri]/MemberMenu';
import ProfileCard from '../../[uri]/ProfileCard';
import CommitteesCard from '../../[uri]/CommitteesCard';
import FormerPositions from '../../[uri]/FormerPositions';
import CommitteeAttendanceChart from '../../[uri]/AttendanceChart';
import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';

export default function LargeTDlayout(props: {
	member: MemberBioData;
}): JSX.Element {
	return (
		<>
			<Grid container spacing={0}>
				<Grid item lg={1.5}>
					<MemberMenu />
				</Grid>
				<Grid item md={0} lg={10.5}>
					<Grid container>
						<Grid item lg={2.5}>
							<ContactCard
								uri={props.member.uri}
								email={props.member.email}
								name={props.member.fullName}
								phoneNumber={props.member.contactNumbers[0]}
								address={props.member.address}
								webpages={props.member.webpages}
							/>
						</Grid>
						<Grid item lg={6.5}>
							<ProfileCard member={props.member} size='lg' />
						</Grid>

						<Grid item lg={3}>
							<Stack direction='column' spacing={1} sx={{ mt: 2, mr: 1 }}>
								{props.member.committees.current.length > 0 && (
									<CommitteesCard committees={props.member.committees} />
								)}
								{props.member.offices?.length! > 0 && (
									<FormerPositions offices={props.member.offices!} />
								)}
							</Stack>
						</Grid>
					</Grid>
					<Grid item lg={12}>
						<Stack direction={'row'} gap={0}>
							<CommitteeAttendanceChart height={300} width={1100} />
							<CommitteeAttendanceChart height={300} width={1100} />
						</Stack>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}
