/** @format */
import { Box } from '@mui/material';
import LargeTDlayout from './lg';
import MobileTDlayout from './xs-mobile';
import SmalllTDlayout from './sm';
import MediumTDlayout from './md';
import CommitteeAttendanceChart from '@/UI-Components/TD/[uri]/AttendanceChart';
import { MemberBioData } from '@/functions/processes/td/_agg_td_details_by_house';

export default function TDlayout(props: { member: MemberBioData }) {
	return (
		<>
			{/* <CommitteeAttendanceChart width={0} height={0} /> */}
			<Box
				sx={{
					display: {
						xs: 'block',
						sm: 'none',
						md: 'none',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<MobileTDlayout member={props.member} />
			</Box>
			<Box
				sx={{
					display: {
						xs: 'none',
						sm: 'block',
						md: 'none',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<SmalllTDlayout member={props.member} />
			</Box>
			<Box
				sx={{
					display: {
						xs: 'none',
						small: 'none',
						md: 'block',
						lg: 'none',
						xl: 'none',
					},
				}}>
				<MediumTDlayout member={props.member} />
			</Box>

			<Box
				sx={{
					display: {
						xs: 'none',
						small: 'none',
						md: 'none',
						lg: 'block',
						xl: 'block',
					},
				}}>
				<LargeTDlayout member={props.member} />
			</Box>
		</>
	);
}
