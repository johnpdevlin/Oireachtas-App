/** @format */
// MUI COMPONENTS
import { Box, Button } from '@mui/material';

type DesktopMenuProps = {
	handleCloseNavMenu: () => void;
	pages: string[];
};

function DesktopMenu({
	handleCloseNavMenu,
	pages,
}: DesktopMenuProps): JSX.Element {
	return (
		<>
			<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
				{pages.map((page) => (
					<Button
						key={page}
						onClick={handleCloseNavMenu}
						size='large'
						sx={{
							mx: 1.2,
							my: 2,
							color: 'white',
							fontSize: '1.3rem',
							textShadow: '0px 0px 1px rgba(0, 0, 0, 6)',
							display: 'block',
						}}>
						{page}
					</Button>
				))}
			</Box>
		</>
	);
}

export default DesktopMenu;
