/** @format */
import { Box } from '@mui/material';
import LargeTDlayout from './lg';
import MobileTDlayout from './xs-mobile';
import SmalllTDlayout from './sm';
import MediumTDlayout from './md';
import CommitteeAttendanceChart from '@/UI-Components/TD/[uri]/AttendanceChart';

import Layout from '@/UI-Components/_layout';
import { MemberBioData } from '@/functions/processes/td/_all_current_agg_td_details';
export default function TDlayout(props: { member: MemberBioData }) {
	return (
		<>
			{/* <CommitteeAttendanceChart /> */}
			{/* <Box
				sx={{
					display: {
						xs: 'block',
						sm: 'none',
						md: 'none',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<MobileTDlayout member={member} />
			</Box> */}
			{/* <Box
				sx={{
					display: {
						xs: 'none',
						sm: 'block',
						md: 'none',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<SmalllTDlayout member={member} />
			</Box> */}
			{/* <Box
				sx={{
					display: {
						xs: 'none',
						small: 'none',
						md: 'block',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<MediumTDlayout member={member} />
			</Box> */}

			<LargeTDlayout member={props.member} />
		</>
	);
}
