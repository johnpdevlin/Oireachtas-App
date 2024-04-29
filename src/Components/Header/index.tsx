/** @format */
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import LogoButton from './LogoButton';
import { Grid } from '@mui/material';
import { useViewport } from '@/hooks/viewportProvider';

const pages = [
	{ name: 'TDs', path: '/td' },
	// { name: 'Constituencies', path: '/constituency' },
	// { name: 'Parties', path: '/party' },
	// { name: 'About', path: '/about' },
];

function HeaderNavBar(): JSX.Element {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	const { breakpoint } = useViewport();
	const [marginTopValue, setMarginTopValue] = useState<number>(1);
	useEffect(() => {
		if (breakpoint === 'xs') setMarginTopValue(1.7);
		else if (breakpoint === 'sm') setMarginTopValue(2.7);
		else if (breakpoint === 'md') setMarginTopValue(2.7);
		else if (breakpoint === 'lg') setMarginTopValue(3.3);
		else if (breakpoint === 'xl') setMarginTopValue(0);
	}, [breakpoint]);

	return (
		<>
			<header>
				<AppBar position='static' sx={{ mb: 4, backgroundColor: 'powderblue' }}>
					<Toolbar>
						{/* MOBILE / SMALL MENU */}

						<MobileMenu
							pages={pages}
							handleOpenNavMenu={handleOpenNavMenu}
							handleCloseNavMenu={handleCloseNavMenu}
							anchorElNav={anchorElNav}
						/>

						{/* END MOBILE MENU */}

						<Grid container>
							{/* LOGO FOR HOME */}
							<Grid item xs={7} sm={8} md={3} lg={2.5} sx={{ mt: 1 }}>
								<LogoButton />
							</Grid>
							{/* END LOGO FOR HOME */}

							{/* DESKTOP MENU */}
							<Grid item md={6.5} lg={6.5}>
								<DesktopMenu pages={pages} />
							</Grid>
							{/* END DESKTOP MENU */}

							{/* SEARCHBAR */}
							<Grid
								item
								xs={5}
								sm={4}
								md={2.5}
								lg={3}
								sx={{ mt: marginTopValue, mb: 1 }}>
								{/* <SearchBar /> */}
							</Grid>
							{/* END SEARCHBAR */}
						</Grid>
					</Toolbar>
				</AppBar>
			</header>
		</>
	);
}
export default HeaderNavBar;
