/** @format */
import { Box } from '@mui/material';
import LargeTDlayout from './lg';
import MobileTDlayout from './xs-mobile';
import SmalllTDlayout from './sm';
import MediumTDlayout from './md';
import AttendanceChart from '@/UI-Components/TD/[uri]/AttendanceChart';
import { MemberPageData } from '@/models/ui/member';

export default function TDlayout({ bio, attendance }: MemberPageData) {
	return (
		<>
			<AttendanceChart width={0} height={0} data={attendance.house} />
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
				<MobileTDlayout bio={bio} />
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
				<SmalllTDlayout bio={bio} />
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
				<MediumTDlayout bio={bio} />
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
				<LargeTDlayout bio={bio} />
			</Box>
		</>
	);
}
