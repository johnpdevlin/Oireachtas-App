/** @format */

import { Container, Grid } from '@mui/material';
import Head from 'next/head';
import ProfileCard from './ProfileCard';
import ContributionTabs from './ContributionTabs';
import { Member } from '../../../Models/UI/member';

type TDlayoutProps = {
	td: Member;
};

export default function TDlayout({ td }: TDlayoutProps) {
	return (
		<>
			<Container>
				<Grid container spacing={2}>
					<Grid item lg={8}>
						<ProfileCard member={td} />
						{/* <RecordsCard /> */}
						{/* <ContributionTabs /> */}
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
