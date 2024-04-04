/** @format */

import { Grid, Stack } from '@mui/material';
import ContactCard from '../../[uri]/Bio/ContactCard';
import MemberMenu from '../../[uri]/MemberMenu';
import ProfileCard from '../../[uri]/Bio/ProfileCard';
import CommitteesCard from '../../[uri]/Bio/CommitteesCard';
import FormerPositions from '../../[uri]/Bio/FormerPositions';
import CommitteeAttendanceChart from '../../[uri]/Attendance/AttendanceChart';
import { MemberBioData } from '@/models/ui/member';

export default function LargeTDlayout(props: {
	bio: MemberBioData;
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
								uri={props.bio.uri}
								email={props.bio.email}
								name={props.bio.fullName}
								phoneNumber={props.bio.contactNumbers[0]}
								address={props.bio.address}
								webpages={props.bio.webpages}
							/>
						</Grid>
						<Grid item lg={6.5}>
							<ProfileCard member={props.bio} size='lg' />
						</Grid>

						<Grid item lg={3}>
							<Stack direction='column' spacing={1} sx={{ mt: 2, mr: 1 }}>
								{props.bio.committees.current.length > 0 && (
									<CommitteesCard committees={props.bio.committees} />
								)}
								{props.bio.offices?.length! > 0 && (
									<FormerPositions offices={props.bio.offices!} />
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
