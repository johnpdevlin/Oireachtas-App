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
	WorkHistory,
} from '@mui/icons-material';
import HoverableFootnote from '../../../_utils/HoverableFootnote';
import {
	calculateRawDaysBetweenDates,
	calculateYearsAndMonthsSinceDate,
	convertDaysToYearsAndMonths,
	formatDateToString,
} from '@/functions/_utils/dates';
import { capitaliseFirstLetters } from '../../../../functions/_utils/strings';
import {
	MemberPageBioData,
	MemberPageMembership,
} from '@/models/pages/member/member';
import { getCurrentAndPastMemberships } from '@/functions/_utils/memberships';

function BasicDetails(props: { member: MemberPageBioData; size: Breakpoint }) {
	const {
		birthDate,
		birthPlace,
		gender,
		education,
		almaMater,
		parties,
		offices,
		constituencies,
		partyPositions,
		otherPositions,
		committees,
	} = props.member;

	const formattedBirthdate = birthDate
		? formatDateToString(birthDate)
		: undefined;

	const age = () => {
		return calculateYearsAndMonthsSinceDate(birthDate!).years;
	};

	const formatFormerMemberships = (
		memberships: MemberPageMembership[]
	): string => {
		const mapped = memberships.map((m, key) => {
			return `${capitaliseFirstLetters(m.name)} (${new Date(
				m.dateRange.start
			).getFullYear()} - ${new Date(m.dateRange.end!).getFullYear()})`;
		});
		return mapped.join(', ');
	};

	const formerParties =
		parties.length > 1 && formatFormerMemberships(parties.slice(1));

	const formattedConstituencies = () => {
		// Merge all arrays into one, handling undefined arrays
		const allItems = [
			...(constituencies.dail || []),
			...(constituencies.seanad || []),
			...(constituencies.other || []),
		];
		// Apply getCurrentAndPastItems function to all items
		let processedItems = getCurrentAndPastMemberships(allItems);

		// If there are no current items, return the most recent item from dail if it's defined
		if (processedItems.current.length === 0) {
			// Get the first item from the defined array
			if (constituencies.dail && constituencies.dail.length > 0) {
				processedItems.current = constituencies.dail[0];
				processedItems.past =
					processedItems.past.filter(
						(item) => item.uri !== constituencies!.dail![0].uri
					) ?? undefined;
			} else if (constituencies.seanad && constituencies.seanad.length > 0) {
				processedItems.current = constituencies.seanad[0];
				processedItems.past = processedItems.past.filter(
					(item) => item.uri !== constituencies!.seanad![0].uri
				);
			}
		}
		if (processedItems.past.length === 0) processedItems.past = undefined;
		return processedItems;
	};

	const formerOffices =
		offices?.filter((off) => off.dateRange.end!) ??
		([] as MemberPageMembership[]);
	const formerPartyPositions =
		partyPositions?.filter((pos) => pos.dateRange.end!) ??
		([] as MemberPageMembership[]);
	const formerOtherPositions =
		otherPositions?.filter((pos) => pos.dateRange.end!) ??
		([] as MemberPageMembership[]);

	const firstElected = () => {
		const dail =
			constituencies.dail &&
			formatDateToString(
				constituencies?.dail!.at(-1)?.dateRange.start as string
			);
		const seanad =
			constituencies.seanad &&
			formatDateToString(
				constituencies?.seanad!.at(-1)?.dateRange.start as string
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
								<b>{formattedConstituencies().current[0].name}</b>
								{formattedConstituencies()!.past! && (
									<HoverableFootnote
										name={' [note]'}
										text={formatFormerMemberships(
											formattedConstituencies().past
										)}
									/>
								)}
							</>
						}
					/>

					{props.size !== 'lg' && committees?.current && (
						<RowComponent
							title='Committees'
							icon={<Groups fontSize='small' />}
							data={
								<>
									{committees.current.map((c, index) => {
										return (
											<Stack
												direction='row'
												gap={0.5}
												key={`${index}-${c.name}`}>
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
					{props.size !== 'lg' &&
						(formerOffices || formerPartyPositions || formerOtherPositions) && (
							<RowComponent
								title='Former Positions'
								icon={<Work fontSize='inherit' />}
								data={
									<>
										{formerOffices &&
											formerOffices.map((c, _) => (
												<Stack direction='row' gap={0.5} key={_}>
													<CropSquareRounded
														fontSize='inherit'
														sx={{ mt: 0.4 }}
													/>
													<Typography variant='subtitle2' align='left'>
														{c.name}
													</Typography>
												</Stack>
											))}
										{formerPartyPositions &&
											formerPartyPositions.map((pp, _) => (
												<Stack direction='row' gap={0.5} key={_}>
													<CropSquareRounded
														fontSize='inherit'
														sx={{ mt: 0.4 }}
													/>
													<Typography variant='subtitle2' align='left'>
														{pp.name}
													</Typography>
												</Stack>
											))}
										{formerOtherPositions &&
											formerOtherPositions.map((op, _) => (
												<Stack direction='row' gap={0.5} key={_}>
													<CropSquareRounded
														fontSize='inherit'
														sx={{ mt: 0.4 }}
													/>
													<Typography variant='subtitle2' align='left'>
														{op.name}
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
									{education.map((name) => (
										<b key={name}>{name}</b>
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
									{almaMater.map((name) => (
										<b key={name}>{name}</b>
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
