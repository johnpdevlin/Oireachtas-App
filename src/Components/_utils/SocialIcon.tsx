/** @format */

import { Stack, Tooltip, Typography } from '@mui/material';
import { capitaliseFirstLetters } from '../../functions/_utils/strings';
import { WebsitePair } from '@/models/_utils';

// Import icons
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import XIcon from '@mui/icons-material/x';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import Link from 'next/link';
import { formatURL } from '../../functions/_utils/urls';

function SocialIcon(props: {
	page: WebsitePair;
	color: string;
	includeText?: boolean;
}) {
	const { page, color, includeText } = props;
	const websiteIcons = {
		default: {
			icon: <LinkOutlinedIcon sx={{ color: color }} />,
			title: page.website,
		},
		facebook: {
			icon: <FacebookOutlinedIcon sx={{ color: color }} />,
			title: 'Facebook',
		},
		twitter: { icon: <XIcon sx={{ color: color }} />, title: 'Twitter / X' },
		youtube: { icon: <YouTubeIcon sx={{ color: color }} />, title: 'Youtube' },
		linkedin: {
			icon: <LinkedInIcon sx={{ color: color }} />,
			title: 'LinkedIn',
		},
		personal: {
			icon: <LinkOutlinedIcon sx={{ color: color }} />,
			title: 'Personal Website',
		},
		party: {
			icon: <GroupsOutlinedIcon sx={{ color: color }} />,
			title: 'Party Profile',
		},
		oireachtas: {
			icon: <AccountBalanceOutlinedIcon sx={{ color: color }} />,
			title: 'Oireachtas Profile',
		},
		wikipedia: {
			icon: (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					x='0px'
					y='0px'
					width='27'
					height='27'
					style={{ fill: props.color }}
					viewBox='0 0 24 24'>
					<path d='M 19 3 L 5 3 C 3.898438 3 3 3.898438 3 5 L 3 19 C 3 20.101563 3.898438 21 5 21 L 19 21 C 20.101563 21 21 20.101563 21 19 L 21 5 C 21 3.898438 20.101563 3 19 3 Z M 19.800781 8.601563 C 19.800781 8.699219 19.699219 8.800781 19.601563 8.800781 L 18.699219 8.800781 L 14.398438 17.898438 C 14.398438 18 14.300781 18 14.199219 18 C 14.101563 18 14.101563 18 14 17.898438 L 12 13.898438 L 9.800781 17.898438 C 9.898438 18 9.800781 18 9.800781 18 C 9.699219 18 9.699219 18 9.601563 17.898438 L 5.300781 8.800781 L 4.300781 8.800781 C 4.199219 8.800781 4.101563 8.699219 4.101563 8.601563 L 4.101563 8.199219 C 4.199219 8.101563 4.199219 8 4.300781 8 L 7.800781 8 C 7.898438 8 8 8.101563 8 8.199219 L 8 8.699219 C 8 8.800781 7.898438 8.898438 7.800781 8.898438 L 7.101563 8.898438 L 10.101563 15.800781 L 11.699219 12.898438 L 9.699219 8.898438 L 9.199219 8.898438 C 9.101563 8.800781 9 8.699219 9 8.601563 L 9 8.199219 C 9 8.101563 9.101563 8 9.199219 8 L 11.800781 8 C 11.898438 8 12 8.101563 12 8.199219 L 12 8.699219 C 12 8.800781 11.898438 8.898438 11.800781 8.898438 L 11.300781 8.898438 L 12.398438 11.398438 L 13.699219 8.898438 L 12.898438 8.898438 C 12.800781 8.898438 12.699219 8.800781 12.699219 8.699219 L 12.699219 8.199219 C 12.699219 8.101563 12.800781 8 12.898438 8 L 15.398438 8 C 15.5 8 15.601563 8.101563 15.601563 8.199219 L 15.601563 8.699219 C 15.601563 8.800781 15.5 8.898438 15.398438 8.898438 L 14.898438 8.898438 L 12.898438 12.5 L 14.5 15.800781 L 17.601563 8.898438 L 16.601563 8.898438 C 16.5 8.898438 16.398438 8.800781 16.398438 8.699219 L 16.398438 8.199219 C 16.398438 8.101563 16.5 8 16.601563 8 L 19.601563 8 C 19.699219 8 19.800781 8.101563 19.800781 8.199219 Z'></path>
				</svg>
			),
			title: 'Wikipedia',
		},
	};

	const websiteIcon = websiteIcons[page.website] || websiteIcons.default;

	return (
		<Tooltip title={page.website}>
			<Link href={formatURL(page.url)}>
				<Stack direction='row' gap={0.5}>
					{websiteIcon.icon}
					{includeText && (
						<Typography variant='subtitle1' color={color}>
							{capitaliseFirstLetters(websiteIcon.title)}
						</Typography>
					)}
				</Stack>
			</Link>
		</Tooltip>
	);
}

export default SocialIcon;
