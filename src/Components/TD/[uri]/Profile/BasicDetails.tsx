/** @format */
import * as React from 'react';

import Typography from '@mui/material/Typography';

import {
	Breakpoint,
	Grid,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '@mui/material';
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
	AccessTime,
	WorkHistory,
} from '@mui/icons-material';
import HoverableFootnote from '../../../_utils/HoverableFootnote';
import {
	calculateRawDaysBetweenDates,
	calculateYearsAndMonthsSinceDate,
	convertDaysToYearsAndMonths,
	formatDateToString,
} from '@/functions/_utils/dates';
import { MemberConstituency } from '@/models/oireachtas_api/Formatted/Member/constituency';
import { capitaliseFirstLetters } from '../../../../functions/_utils/strings';
import { MemberParty } from '@/models/member/_all_bio_data';
import { MemberBioData } from '@/models/pages/member/member';

function BasicDetails(props: { member: MemberBioData; size: Breakpoint }) {
	const {
		birthDate,
		birthPlace,
		education,
		almaMater,
		parties,
		offices,
		constituencies,
		isActiveTD,
		isActiveSenator,
		committees,
	} = props.member;

	const formattedBirthdate = birthDate
		? formatDateToString(birthDate)
		: undefined;

	const age = () => {
		return calculateYearsAndMonthsSinceDate(birthDate!).years;
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
		const dail = formatDateToString(
			constituencies!.dail!.at(-1)?.dateRange.start as string
		);
		const seanad = formatDateToString(
			constituencies!.seanad!.at(-1)?.dateRange.start as string
		);
		return {
			dail: dail !== 'Invalid Date' ? dail : undefined,
			seanad: seanad !== 'Invalid Date' ? seanad : undefined,
		};
	};

	const duration = () => {
		let dailDays = 0;
		let seanadDays = 0;

		const { dail, seanad } = constituencies;
		dail?.forEach(
			(d) => (dailDays += calculateRawDaysBetweenDates(d.dateRange))
		);
		seanad?.forEach(
			(s) => (seanadDays += calculateRawDaysBetweenDates(s.dateRange))
		);

		const overallPeriod = convertDaysToYearsAndMonths(dailDays + seanadDays);

		return overallPeriod;
	};

	return (
		<>
			<Table size='small'>
				<TableBody>
					{formattedBirthdate && birthPlace && (
						<RowComponent
							title='Born'
							icon={<Cake fontSize='small' />}
							data={
								<>
									<b>{formattedBirthdate}</b> (age {age()})
									<br />
									<small>
										<i>{birthPlace}</i>
									</small>
								</>
							}
						/>
					)}
					<RowComponent
						title='First Elected'
						icon={<HourglassEmpty fontSize='small' />}
						data={
							<Grid container gap={1}>
								<Grid item>
									{firstElected().dail !== undefined && (
										<b>{firstElected().dail}</b>
									)}
									{firstElected().dail !== undefined &&
										firstElected().seanad !== undefined && <br />}
									{firstElected().seanad !== undefined && (
										<b>{firstElected().seanad}</b>
									)}
								</Grid>
								<Grid item>
									{firstElected().dail! && <small>(Dáil)</small>}
									{firstElected().dail! && firstElected().seanad! && <br />}
									{firstElected().seanad! && <small>(Seanad)</small>}
								</Grid>
							</Grid>
						}
					/>
					<RowComponent
						title='Duration in Oireachtas'
						icon={<WorkHistory fontSize='small' />}
						data={
							<Grid container gap={2}>
								<Grid item>
									<b>
										{duration().years} years, {duration().months} months
									</b>{' '}
									~
								</Grid>
							</Grid>
						}
					/>
					<RowComponent
						title='Party'
						icon={<HowToVote fontSize='small' />}
						data={
							<>
								<b>{parties[0].name}</b>
								{formerParties! && (
									<HoverableFootnote name=' [note]' text={formerParties} />
								)}
							</>
						}
					/>
					<RowComponent
						title='Constituency'
						icon={<Place fontSize='small' />}
						data={
							<>
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
							</>
						}
					/>

					{props.size !== 'lg' &&
						(committees.current.length > 0 || committees.past.length > 0) && (
							<RowComponent
								title='Committees'
								icon={<Groups fontSize='small' />}
								data={
									<>
										{' '}
										{committees.current.map((c, index) => {
											return (
												<Stack
													direction='row'
													gap={0.5}
													key={`${index}-${c.committeeID}`}>
													<CropSquareRounded
														fontSize='inherit'
														sx={{ mt: 0.4 }}
													/>
													<Typography variant='subtitle2' align='left'>
														{c.name}
													</Typography>
												</Stack>
											);
										})}
									</>
								}
							/>
						)}
					{props.size !== 'lg' && formerOffices.length > 0 && (
						<RowComponent
							title='Former Positions'
							icon={<Work fontSize='inherit' />}
							data={
								<>
									{formerOffices.map((c) => (
										<Stack direction='row' gap={0.5}>
											<CropSquareRounded fontSize='inherit' sx={{ mt: 0.4 }} />
											<Typography variant='subtitle2' align='left'>
												{c.name}
											</Typography>
										</Stack>
									))}
								</>
							}
						/>
					)}

					{education && (
						<RowComponent
							title='Education'
							icon={<HistoryEdu fontSize='small' />}
							data={
								<>
									{education.map((ed) => (
										<b key={ed.wikiURI}>{ed.name}</b>
									))}
								</>
							}
						/>
					)}
					{almaMater && (
						<RowComponent
							title='Alma Mater'
							icon={<School fontSize='small' />}
							data={
								<>
									{almaMater.map((am) => (
										<b key={am.name}>{am.name}</b>
									))}
								</>
							}
						/>
					)}
				</TableBody>
			</Table>
		</>
	);
}
const RowComponent = (props: {
	title: string;
	icon: JSX.Element;
	data: JSX.Element | string | JSX.Element[];
}): JSX.Element => {
	const renderData = () => {
		if (typeof props.data === 'string') {
			return (
				<Typography variant='body1' align='left'>
					{props.data}
				</Typography>
			);
		} else if (Array.isArray(props.data)) {
			return (
				<>
					{props.data.map((item, index) => (
						<Typography variant='body1' align='left' key={index}>
							{item}
						</Typography>
					))}
				</>
			);
		} else {
			return props.data;
		}
	};

	return (
		<TableRow
			sx={{
				borderBottom: '0.5px #CDD7E1 solid',
			}}>
			<TableCell
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					borderBottom: 'none',
				}}>
				<Stack direction='row' alignItems='flex-start' spacing={1}>
					{props.icon}
					<Typography variant='body1' align='left'>
						{props.title}:
					</Typography>
				</Stack>
			</TableCell>
			<TableCell sx={{ borderBottom: 'none' }}>{renderData()}</TableCell>
		</TableRow>
	);
};

export default BasicDetails;
