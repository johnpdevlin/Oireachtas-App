/** @format */

import {
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import Link from 'next/link';
import { mergeMembershipPeriods } from '../Fetcher/OireachtasAPI/Formatter/Memberships/Functions';

import { member } from '../Models/UI/member';

export default function TDcard(props: { member: member }) {
	const imgUrl = `https://data.oireachtas.ie/ie/oireachtas/member/id/${props.member.uri}/image/large`;
	const offices = props.member.offices;

	let count = 0;
	let conCount = 0; //count for past Constituency

	const party = props.member.party;
	const constituency = props.member.constituency;

	return (
		<>
			<Grid item sx={{}}>
				<Paper
					sx={{
						p: 2.5,
						display: 'flex',
						minWidth: '100%',
						flexDirection: 'column',
						mb: '10px',
					}}>
					<Grid
						container
						spacing={2}
						sx={{ minWidth: '100%', display: 'flex' }}>
						<Grid item sx={{}}>
							<Link href={`/td/${props.member.uri}`}>
								<img
									src={imgUrl}
									alt={props.member.fullName}
									width={150}
									height={150}
									style={{
										borderBottomLeftRadius: 5,
										borderBottomRightRadius: 5,
										borderTopRightRadius: 5,
										borderTopLeftRadius: 5,
										overflow: 'hidden',
									}}
								/>
							</Link>
							<Typography variant='body1' color='primary' align='center'>
								<b>
									<Link href={`/td/${props.member.uri}`}>
										{props.member.fullName}
									</Link>
								</b>
							</Typography>
							<Typography variant='body2' color='text.secondary' align='center'>
								<b>
									<Link href={`/party/${party?.uri}`}>{party?.name}</Link>
								</b>
							</Typography>
							<Typography variant='body2' color='text.secondary' align='center'>
								<b>
									<Link href={`/constituency/${constituency?.uri}`}>
										{constituency?.name}
									</Link>
								</b>
							</Typography>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</>
	);
}
