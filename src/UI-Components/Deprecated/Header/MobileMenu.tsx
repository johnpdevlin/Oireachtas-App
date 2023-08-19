/** @format */

import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type MobileMenuProps = {
	handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
	handleCloseNavMenu: () => void;
	anchorElNav: null | HTMLElement;
	pages: string[];
};

function MobileMenu({
	handleOpenNavMenu,
	handleCloseNavMenu,
	anchorElNav,
	pages,
}: MobileMenuProps): JSX.Element {
	return (
		<>
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
						<MenuItem key={page} onClick={handleCloseNavMenu}>
							<Typography textAlign='center'>{page}</Typography>
						</MenuItem>
					))}
				</Menu>
			</Box>
		</>
	);
}

export default MobileMenu;
