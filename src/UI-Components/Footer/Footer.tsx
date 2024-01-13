/** @format */

import webdetails from '@/Data/website';
import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
	return (
		<footer>
			<Box
				component='footer'
				bgcolor='powderblue'
				color='white'
				px={10}
				py={3}
				mt='auto' // This will push the footer to the bottom
			>
				<Grid container justifyContent='space-between' alignItems='center'>
					<Grid item display='flex' justifyContent='flex-start'>
						<Typography
							variant='h6'
							sx={{ textShadow: '0px 0px 1px rgba(0, 0, 0, 6)' }}>
							&copy; {webdetails.currentYear} {webdetails.owner}
						</Typography>
					</Grid>
					<Grid item alignItems={'flex-end'}>
						<Stack direction='row' gap={1} justifyContent='flex-end'>
							{webdetails.links.github && (
								<Link
									href={webdetails.links.github}
									target='_blank'
									rel='noopener'
									color='inherit'>
									<GitHubIcon fontSize='large' />
								</Link>
							)}
							{webdetails.links.twitter && (
								<Link
									href={webdetails.links.twitter}
									target='_blank'
									rel='noopener'
									color='inherit'>
									<TwitterIcon fontSize='large' />
								</Link>
							)}
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</footer>
	);
};

export default Footer;
