/** @format */

import { Box } from '@mui/material';
import { MemberPageBioData } from '@/models/pages/member/member';
import XS_ProfileLayout from '../../Layouts/[uri]/Profile/xs';
import SM_ProfileLayout from '../../Layouts/[uri]/Profile/sm';
import MD_ProfileLayout from '../../Layouts/[uri]/Profile/md';
import LG_ProfileLayout from '../../Layouts/[uri]/Profile/lg';

type BioProps = {
	bio: MemberPageBioData;
};

export default function MemberProfile({ bio }: BioProps) {
	return (
		<Box marginBottom={15}>
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
				<XS_ProfileLayout bio={bio} />
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
				<SM_ProfileLayout bio={bio} />
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
				<MD_ProfileLayout bio={bio} />
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
				<LG_ProfileLayout bio={bio} />
			</Box>
		</Box>
	);
}
