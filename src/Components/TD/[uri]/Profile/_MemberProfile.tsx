/** @format */

import { Box } from '@mui/material';
import { MemberPageBioData } from '@/models/pages/member/member';
import XS_ProfileLayout from './Layout/xs';
import LG_ProfileLayout from './Layout/lg';

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
						md: 'block',
						lg: 'block',
						xl: 'block',
					},
				}}>
				<LG_ProfileLayout bio={bio} />
			</Box>
		</Box>
	);
}
