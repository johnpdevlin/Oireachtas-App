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

import { member } from '../../Models/UI/member';

export default function TDprofile(props: { member: member }) {
	const imgUrl = `https://data.oireachtas.ie/ie/oireachtas/member/id/${props.member.uri}/image/large`;
	const offices = props.member.offices;
	const pastParties = props.member.pastParties;
	let count = 0;
	let conCount = 0; //count for past Constituency

	return (
		<>
			<Paper
				sx={{
					p: 2.5,
					display: 'flex',
					minWidth: '100%',
					flexDirection: 'column',
				}}>
				<Grid
					container
					spacing={1.8}
					sx={{ minWidth: '100%', display: 'flex' }}>
					<Grid item sx={{}}>
						<img
							src={imgUrl}
							alt={props.member.fullName}
							width={170}
							height={170}
							style={{
								borderBottomLeftRadius: 5,
								borderBottomRightRadius: 5,
								borderTopRightRadius: 5,
								borderTopLeftRadius: 5,
								overflow: 'hidden',
							}}
						/>
					</Grid>
					<Grid item sx={{}}>
						<Typography
							component='h1'
							variant='h4'
							color='primary'
							gutterBottom>
							{props.member.fullName}{' '}
							<small style={{ color: 'GrayText', fontSize: '19px' }}>
								{offices!
									? offices.map((o) => {
											return `(${o.name})`;
									  })
									: null}
							</small>
						</Typography>

						<Table size='small'>
							<TableHead></TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											Party:
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											<b>
												{props.member.party ? props.member.party.name : null}
											</b>
											<small>
												<i>
													{pastParties!.length > 0 ? ' formerly ' : null}
													{pastParties
														? pastParties.map((pp) => {
																if (count > 0) {
																	return `, ${pp.name}`;
																}
																count++;
																return `${pp.name}`;
														  })
														: null}
												</i>
											</small>
										</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											Constituency:
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											<b>
												{props.member.constituency?.name
													? props.member.constituency.name
													: null}
											</b>
											{props.member.isCurrent == false
												? props.member.pastConstituencies!.length == 1
													? props.member.pastConstituencies![0].name
													: null
												: null}
											<small>
												<i>
													{props.member.pastConstituencies!.length > 0
														? ' formerly '
														: null}
													{props.member.pastConstituencies
														? props.member.pastConstituencies.map((pc) => {
																if (conCount > 0) {
																	return `, ${pc.name}`;
																}
																conCount++;
																return `${pc.name}`;
														  })
														: null}
												</i>
											</small>
										</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											Duration in Oireachtas:
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant='body2'
											color='text.secondary'
											align='left'>
											<b>
												{new Date(props.member.firstElected).getFullYear()}
												{' - '}
												{props.member.isCurrent
													? 'Present'
													: new Date(props.member.cessation!).getFullYear()}
											</b>
										</Typography>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}
