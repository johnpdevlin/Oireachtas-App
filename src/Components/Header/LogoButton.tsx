/** @format */

import Link from 'next/link';
import Image from 'next/image';

// INTERNAL COMPONENTS
import logo from '@/images/logo.png';
import { useEffect, useState } from 'react';
import { useViewport } from '@/hooks/viewportProvider';
import { Box } from '@mui/material';

export default function LogoButton(): JSX.Element {
	const { breakpoint } = useViewport();
	const [imgSize, setImgSize] = useState<number>(0);
	useEffect(() => {
		if (breakpoint === 'xs') setImgSize(80);
		else if (breakpoint === 'sm') setImgSize(80);
		else if (breakpoint === 'md') setImgSize(80);
		else if (breakpoint === 'lg') setImgSize(100);
		else if (breakpoint === 'xl') setImgSize(100);
	}, [breakpoint]);

	return (
		<Link href='/'>
			<Box>
				<Image
					alt='WithGreatPower logo'
					src={logo}
					height={imgSize}
					width={imgSize * 3.2}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			</Box>
		</Link>
	);
}
