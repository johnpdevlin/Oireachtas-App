/** @format */
import * as React from 'react';

import Typography from '@mui/material/Typography';

import { Stack, Table, TableBody, TableCell, TableRow } from '@mui/material';
import {
	Cake,
	HistoryEdu,
	School,
	HowToVote,
	Place,
	HourglassEmpty,
	Groups,
	CropSquareRounded,
	Work,
} from '@mui/icons-material';
import HoverableFootnote from '../../../_utils/HoverableFootnote';

import {
	calculateYearsAndMonthsSinceDate,
	formatDateToString,
} from '@/functions/_utils/dates';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { capitaliseFirstLetters } from '../../../../functions/_utils/strings';
import { MemberParty } from '@/models/member';
import { ScreenSize } from '@/models/ui';
import { MemberBioData } from '@/models/ui/member';

function BasicDetails(props: { member: MemberBioData; size: ScreenSize }) {
	const {
		birthdate,
		birthplace,
		birthCountry,
		almaMater,
		parties,
		offices,
		constituencies,
		isActiveTD,
		isActiveSenator,
		committees,
	} = props.member;

	const formattedBirthdate = birthdate
		? formatDateToString(birthdate)
		: undefined;

	const age = () => {
		return calculateYearsAndMonthsSinceDate(birthdate!).years;
	};
	const formerDailConstituencies = () => {
		if (constituencies.dail!.length >= 1) {
			if (isActiveTD! && constituencies.dail!.length > 1)
				return constituencies.dail!.slice(1);
			else if (isActiveSenator!) return constituencies.dail!;
		} else return [];
	};
	const formerSeanadConstituencies = () => {
		if (constituencies.seanad!.length >= 1) {
			if (isActiveSenator! && constituencies.seanad!.length > 1)
				return constituencies.seanad!.slice(1);
			else if (isActiveTD!) return constituencies.seanad!;
		} else return [];
	};

	const formatFormerMemberships = (
		memberships: MemberConstituency[] | MemberParty[]
	): string => {
		const mapped = memberships.map((m, key) => {
			return `${capitaliseFirstLetters(m.name)} (${new Date(
				m.dateRange.start
			).getFullYear()} - ${new Date(m.dateRange.end!).getFullYear()})`;
		});
		return mapped.join(', ');
	};

	const formerConstituencies = () => {
		let arr: MemberConstituency[] = [];
		if (formerDailConstituencies()!)
			arr.push(...(formerDailConstituencies() as MemberConstituency[]));
		if (formerSeanadConstituencies()!)
			arr.push(...(formerSeanadConstituencies() as MemberConstituency[]));

		if (arr.length > 0) return formatFormerMemberships(arr);
		else return undefined;
	};

	const formerParties =
		parties.length > 1 && formatFormerMemberships(parties.slice(1));

	const formerOffices = offices?.filter((off) => off.dateRange.end!) ?? [];

	const firstElected = () => {
		if (isActiveTD!)
			return formatDateToString(
				constituencies!.dail!.at(-1)?.dateRange.start as string
			);
		else if (isActiveSenator!)
			return formatDateToString(
				constituencies!.seanad!.at(-1)?.dateRange.start as string
			);
	};

	return (
		<>
			<Table size='small'>
				<TableBody>
					<TableRow>
						<TableCell>
							<Stack direction='row'>
								<Cake fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									Born:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>{formattedBirthdate}</b> (age {age()})
								<br />
								<small>
									<i>
										{birthplace}, {birthCountry}
									</i>
								</small>
							</Typography>
						</TableCell>
					</TableRow>
					{/** Education Data needs to be researched etc.*/}
					{/* <TableRow>
						<TableCell>
							<Stack direction='row'>
								<HistoryEdu fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									Education:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>The King's Hospital </b>

								<small>
									<i>(private)</i>
								</small>
							</Typography>
						</TableCell>
					</TableRow> */}
					{almaMater && (
						<TableRow>
							<TableCell>
								<Stack direction='row'>
									<School fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Alma Mater:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								<Typography variant='body2' align='left'>
									<b> {almaMater}</b>
								</Typography>
							</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>
							<Stack direction='row'>
								<HowToVote fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									Party:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>{parties[0].name}</b>
								{formerParties! && (
									<HoverableFootnote name=' [note]' text={formerParties} />
								)}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<Stack direction='row'>
								<Place fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									Constituency:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>
									{isActiveTD! && constituencies!.dail[0]!.name!}
									{isActiveSenator! && constituencies!.seanad[0]!.name!}
								</b>
								{formerConstituencies! && (
									<HoverableFootnote
										name={' [note]'}
										text={formerConstituencies()!}
									/>
								)}
							</Typography>
						</TableCell>
					</TableRow>
					{props.size !== 'lg' && (
						<TableRow>
							<TableCell sx={{ verticalAlign: 'top' }}>
								<Stack direction='row' sx={{ verticalAlign: 'top' }}>
									<Groups fontSize='small' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Committees:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								{committees.current.map((c) => {
									return (
										<Stack direction='row' gap={0.5}>
											<CropSquareRounded fontSize='inherit' sx={{ mt: 0.4 }} />
											<Typography variant='subtitle2' align='left'>
												{c.name}
											</Typography>
										</Stack>
									);
								})}
							</TableCell>
						</TableRow>
					)}
					{props.size !== 'lg' && formerOffices.length > 0 && (
						<TableRow>
							<TableCell sx={{ verticalAlign: 'top' }}>
								<Stack direction='row' sx={{ verticalAlign: 'top' }}>
									<Work fontSize='inherit' />
									<Typography
										variant='body2'
										align='left'
										sx={{ ml: 0.5, mt: 0.1 }}>
										Former Positions:
									</Typography>
								</Stack>
							</TableCell>
							<TableCell>
								{formerOffices.map((c) => {
									return (
										<Stack direction='row' gap={0.5}>
											<CropSquareRounded fontSize='inherit' sx={{ mt: 0.4 }} />
											<Typography variant='subtitle2' align='left'>
												{c.name}
											</Typography>
										</Stack>
									);
								})}
							</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell>
							<Stack direction='row'>
								<HourglassEmpty fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									First Elected:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>{firstElected()}</b>
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
}

export default BasicDetails;
