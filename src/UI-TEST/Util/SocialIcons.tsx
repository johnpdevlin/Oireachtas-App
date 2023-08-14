/** @format */

import { Language, Facebook, Twitter, YouTube } from '@mui/icons-material';
import { Stack } from '@mui/material';
import Image from 'next/image';

export default function SocialIcons() {
	return (
		<>
			<Stack
				spacing={{ sm: 1.0, md: 1.5 }}
				direction='row'
				useFlexGap
				flexWrap='wrap'
				alignItems='left'>
				<Language fontSize='large' />
				<Facebook fontSize='large' />
				<Twitter fontSize='large' />
				<YouTube fontSize='large' />
				<Image
					src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/256px-Wikipedia%27s_W.svg.png?20220824035851'
					width={'35'}
					height={'35'}
					style={{}}
					alt='wikipedia'
				/>
			</Stack>
		</>
	);
}
