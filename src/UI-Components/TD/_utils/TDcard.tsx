/** @format */

import { MemberAPIdetails } from '@/models/oireachtasApi/Formatted/Member/member';
import { Grid, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import ProfileImage from './ProfileImg';

export default function TDcard(props: { member: MemberAPIdetails }) {
	const imgUrl = `https://data.oireachtas.ie/ie/oireachtas/member/id/${props.member.uri}/image/large`;
	const offices = props.member.offices;

	const party = props.member.parties[0];
	const constituency = props.member.constituencies.dail![0];

	return (
		<>
			<Paper sx={{ minHeight: '370px' }}>
				<Link href={`/td/${props.member.uri}`}>
					<ProfileImage
						uri={props.member.uri}
						size={210}
						name={props.member.fullName}
					/>

					<Typography variant='h5' color='primary' align='center'>
						{props.member.fullName}
					</Typography>
					<Typography variant='body2' color='text.secondary' align='center'>
						<b>{party?.name}</b>
					</Typography>
					<Typography variant='body2' color='text.secondary' align='center'>
						<b>{constituency?.name}</b>
					</Typography>
				</Link>
			</Paper>
		</>
	);
}
