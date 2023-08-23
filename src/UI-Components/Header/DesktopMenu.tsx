/** @format */
// MUI COMPONENTS
import { useViewport } from '@/hooks/viewportProvider';
import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type DesktopMenuProps = {
	pages: { name: string; path: string }[];
};

function DesktopMenu({ pages }: DesktopMenuProps): JSX.Element {
	const { breakpoint } = useViewport();
	const [marginXvalue, setMarginXvalue] = useState<number>(() => 0);
	const [fontSizeValue, setFontSizeValue] = useState<string>(() => '');
	useEffect(() => {
		if (breakpoint === 'md') {
			setMarginXvalue(0);
			setFontSizeValue('1.2rem');
		} else if (breakpoint === 'lg') {
			setMarginXvalue(1);
			setFontSizeValue('1.6rem');
		}
	}, [breakpoint]);
	return (
		<>
			<nav>
				<Box
					sx={{
						flexGrow: 1,
						flexShrink: 10,
						display: { xs: 'none', md: 'flex' },
						my: 2,
						mx: marginXvalue,
					}}>
					{pages.map((page) => (
						<Link href={page.path}>
							<Button
								key={page.path}
								size='large'
								sx={{
									mx: marginXvalue,
									color: 'white',
									fontSize: fontSizeValue,
									textShadow: '0px 0px 1px rgba(0, 0, 0, 6)',
									display: 'block',
								}}>
								{page.name}
							</Button>
						</Link>
					))}
				</Box>
			</nav>
		</>
	);
}

export default DesktopMenu;
