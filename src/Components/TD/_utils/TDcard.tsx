/** @format */

import { MemberAPIdetails } from '@/models/oireachtas_api/Formatted/Member/member';
import { Box, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import ProfileImage from './ProfileImg';
import { useEffect, useState } from 'react';
import { useViewport } from '@/hooks/viewportProvider';

export default function TDcard(props: { member: MemberAPIdetails }) {
	const imgUrl = `https://data.oireachtas.ie/ie/oireachtas/member/id/${props.member.uri}/image/large`;
	const offices = props.member.offices;

	const party = props.member.parties[0];
	const constituency = props.member.constituencies.dail![0];
	const [minHeight, setMinHeight] = useState<number>();
	const size = useViewport();
	useEffect(() => {
		if (size.breakpoint === 'xl') {
			setMinHeight(355);
		} else if (size.breakpoint === 'lg') {
			setMinHeight(355);
		} else if (size.breakpoint === 'md') {
			setMinHeight(345);
		} else if (size.breakpoint === 'sm') {
			setMinHeight(348);
		} else if (size.breakpoint === 'xs') {
			setMinHeight(400);
		}
	}, [size]);
	return (
		<>
			<Paper sx={{ minHeight: minHeight }}>
				<Link href={`/td/${props.member.uri}`}>
					<ProfileImage
						uri={props.member.uri}
						size={220}
						name={props.member.fullName}
					/>

					<Box>
						<Typography variant='h5' color='primary' align='center'>
							{props.member.fullName}
						</Typography>
						<Typography variant='body2' color='text.secondary' align='center'>
							<b>{party?.name}</b>
						</Typography>
						<Typography variant='body2' color='text.secondary' align='center'>
							<b>{constituency?.name}</b>
						</Typography>
					</Box>
				</Link>
			</Paper>
		</>
	);
}
