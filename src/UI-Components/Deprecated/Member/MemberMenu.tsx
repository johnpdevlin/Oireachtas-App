/** @format */

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Portrait from '@mui/icons-material/Portrait';
import Poll from '@mui/icons-material/Poll';
import CardGiftcard from '@mui/icons-material/CardGiftcard';
import MapsHomeWork from '@mui/icons-material/MapsHomeWork';
import CellTower from '@mui/icons-material/CellTower';
export default function MemberMenu() {
	return (
		<MenuList>
			<MenuItem>
				<ListItemIcon>
					<Portrait fontSize='large' />
				</ListItemIcon>
				<ListItemText>Biograghy</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<Poll fontSize='large' />
				</ListItemIcon>
				<ListItemText>Attendance</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<MapsHomeWork fontSize='large' />
				</ListItemIcon>
				<ListItemText>Property</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<CardGiftcard fontSize='large' />
				</ListItemIcon>
				<ListItemText>Interests</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<CellTower fontSize='large' />
				</ListItemIcon>
				<ListItemText>Latest Posts</ListItemText>
			</MenuItem>
		</MenuList>
	);
}
