/** @format */

import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import React from 'react';

type MobileMenuProps = {
	handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
	handleCloseNavMenu: () => void;
	anchorElNav: null | HTMLElement;
	pages: { name: string; path: string }[];
};

function MobileMenu({
	handleOpenNavMenu,
	handleCloseNavMenu,
	anchorElNav,
	pages,
}: MobileMenuProps): JSX.Element {
	return (
		<>
			<nav>
				<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
					{/* Open / close menu toggle button */}
					<IconButton
						size='large'
						aria-label='menu'
						aria-controls='menu-appbar'
						aria-haspopup='true'
						onClick={handleOpenNavMenu}
						color='inherit'>
						<MenuIcon />
					</IconButton>
					{/* END Open / close menu toggle button */}
					<Menu
						id='menu-appbar'
						anchorEl={anchorElNav}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						open={Boolean(anchorElNav)}
						onClose={handleCloseNavMenu}
						sx={{
							display: { xs: 'block', md: 'none' },
						}}>
						{pages.map((page) => (
							<MenuItem key={page.name} onClick={handleCloseNavMenu}>
								<Link href={page.path}>
									<Typography textAlign='center'>{page.name}</Typography>
								</Link>
							</MenuItem>
						))}
					</Menu>
				</Box>
			</nav>
		</>
	);
}

export default MobileMenu;
