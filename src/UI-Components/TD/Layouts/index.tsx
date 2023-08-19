/** @format */
import { Box } from '@mui/material';
import LargeTDlayout from './lg';
import MobileTDlayout from './xs-mobile';
import SmalllTDlayout from './sm';
import MediumTDlayout from './md';
export default function TDlayout() {
	const member = { name: 'Leo Varadkar', uri: 'Leo-Varadkar.D.2007-06-14' };
	return (
		<>
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
				<MobileTDlayout member={member} />
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
				<SmalllTDlayout member={member} />
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
				<MediumTDlayout member={member} />
			</Box>
			<Box
				sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}>
				<LargeTDlayout member={member} />
			</Box>
		</>
	);
}
