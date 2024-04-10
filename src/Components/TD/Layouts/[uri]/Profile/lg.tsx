/** @format */

import MemberMenu from '@/Components/TD/[uri]/MemberMenu';
import CommitteesCard from '@/Components/TD/[uri]/Profile/CommitteesCard';
import FormerPositions from '@/Components/TD/[uri]/Profile/FormerPositions';
import ProfileCard from '@/Components/TD/[uri]/Profile/ProfileCard';
import ContactCard from '@/Components/TD/[uri]/Profile/ContactCard';
import { MemberBioData } from '@/models/ui/member';
import { Grid, Stack } from '@mui/material';

type ProfileLayoutProps = {
	bio: MemberBioData;
};

export default function LG_ProfileLayout({
	bio,
}: ProfileLayoutProps): JSX.Element {
	return (
		<>
			<>
				<Grid container spacing={0}>
					<Grid item lg={1.5}>
						<MemberMenu />
					</Grid>
					<Grid item md={0} lg={10.5}>
						<Grid container>
							<Grid item lg={2.5}>
								<ContactCard
									uri={bio.uri}
									email={bio.email}
									name={bio.fullName}
									phoneNumber={bio.contactNumbers[0]}
									address={bio.address}
									webpages={bio.webpages}
								/>
							</Grid>
							<Grid item lg={6.5}>
								<ProfileCard member={bio} size='lg' />
							</Grid>

							<Grid item lg={3}>
								<Stack direction='column' spacing={1} sx={{ mt: 2, mr: 1 }}>
									{bio.committees.current.length > 0 && (
										<CommitteesCard committees={bio.committees} />
									)}
									{bio.offices?.length! > 0 && (
										<FormerPositions offices={bio.offices!} />
									)}
								</Stack>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</>
		</>
	);
}
