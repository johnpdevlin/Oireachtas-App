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
} from '@mui/icons-material';
import HoverableFootnote from '../../_utils/HoverableFootnote';
import { MemberBioData } from '@/functions/processes/td/get/all_td_details';
import {
	calculateYearsAndMonthsSinceDate,
	formatDateToString,
} from '@/functions/_utils/dates';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { DateRange } from '../../../models/dates';
import { capitaliseFirstLetters } from '../../../functions/_utils/strings';
import { MemberParty } from '@/models/scraped/oireachtas/member';

function BasicDetails(props: { member: MemberBioData }) {
	const {
		birthdate,
		birthplace,
		birthCountry,
		almaMater,
		parties,
		constituencies,
		isActiveTD,
		isActiveSenator,
	} = props.member;

	function formatDateToString(date: Date | string): string {
		if (!(date instanceof Date)) {
			date = new Date(date);
		}

		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString(undefined, options as {}).toString();
	}

	const formattedBirthdate = formatDateToString(birthdate);
	const age = () => {
		return calculateYearsAndMonthsSinceDate(birthdate!).years;
	};
	const formerDailConstituencies = () => {
		if (constituencies.dail!.length >= 1) {
			if (isActiveTD! && constituencies.dail!.length > 1)
				return constituencies.dail!.slice(1);
			else if (isActiveSenator!) return constituencies.dail!;
		} else return undefined;
	};
	const formerSeanadConstituencies = () => {
		if (constituencies.seanad!.length >= 1) {
			if (isActiveSenator! && constituencies.seanad!.length > 1)
				return constituencies.seanad!.slice(1);
			else if (isActiveTD!) return constituencies.seanad!;
		} else return undefined;
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
								{formattedBirthdate} (age {age()})
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
					<TableRow>
						<TableCell>
							<Stack direction='row'>
								<HourglassEmpty fontSize='small' />
								<Typography
									variant='body2'
									align='left'
									sx={{ ml: 0.5, mt: 0.1 }}>
									Duration in Oireachtas:
								</Typography>
							</Stack>
						</TableCell>
						<TableCell>
							<Typography variant='body2' align='left'>
								<b>1 year, 2 months</b>
							</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
}

export default BasicDetails;
