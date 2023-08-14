/** @format */

import { Grid, Stack } from '@mui/material';
import MemberMenu from '../Components/MemberMenu';
import ContactCard from '../Components/ContactCard';
import ProfileCard from '../Components/ProfileCard';
import CommitteesCard from '../Components/CommitteesCard';
import FormerPositions from '../Components/FormerPositions';

export default function LargeTDlayout(props: { member: unknown }): JSX.Element {
	// member: unknown

	return (
		<>
			<>
				{/* <Grid container spacing={2}> */}
				<Grid container spacing={0}>
					<Grid item lg={1.5}>
						<MemberMenu />
					</Grid>
					<Grid item md={0} lg={10.5}>
						<Grid container>
							<Grid item lg={2.5}>
								<ContactCard />
							</Grid>
							<Grid item lg={6.5}>
								<ProfileCard member={props.member} />
							</Grid>

							<Grid item lg={3}>
								<Stack direction='column' spacing={1} sx={{ mt: 2, mr: 1 }}>
									<CommitteesCard />
									<FormerPositions />
								</Stack>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				{/* <BarGraph /> */}
				{/* <CommitteeAttendanceChart /> */}
				{/* <SimpleLineChart /> */}
				{/* <SimpleLineChart data={dummyData} />; */}
				{/* </Grid> */}
			</>
		</>
	);
}
