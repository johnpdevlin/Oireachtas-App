/** @format */

import * as React from 'react';

// MUI COMPONENTS
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.55),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.75),
	},
	marginRight: 0, // Align to the right
	width: '100%',
	[theme.breakpoints.up('xs')]: {
		marginRight: theme.spacing(1), // Align to the right
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',

		[theme.breakpoints.up('sm')]: {
			width: '7ch',
			'&:focus': {
				width: '16ch',
			},
		},
		[theme.breakpoints.up('md')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));

function SearchBar() {
	return (
		<Search>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder='Search…'
				inputProps={{ 'aria-label': 'search' }}
			/>
		</Search>
	);
}

export default SearchBar;
