/** @format */

import * as React from 'react';

import Paper from '@mui/material/Paper';
import {
	styled,
	Table,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	TableContainer,
	tableCellClasses,
	TableFooter,
} from '@mui/material';

import DropDownSelect from '../UI-TEST/Deprecated/DropDownPeriod';
import {
	groupParticipationRecord,
	participationRecord,
} from '../Models/UI/participation';
import Link from 'next/link';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#4a4842',
		color: 'white',
		fontSize: 13,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 13,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

export default function ParticipationTable(props: {
	participation: (participationRecord | groupParticipationRecord)[];
}) {
	const rows: any[] = props.participation.map(
		(p: participationRecord | groupParticipationRecord) => {
			let divisor: number = p.members.length;

			const name = p.name;
			const houseContributed: number =
				(p.houseContributed / (p.houseContributed + p.noHouseContribution)) *
				100;
			const houseVotes: number = p.houseVotes / divisor;
			if (!p.type) {
				p.type = 'td';
			}
			const uri = `/${p.type}/${p.uri}`;
			let oralQuestions: number = p.oralQuestions! / divisor;
			let writtenQuestions: number = p.writtenQuestions! / divisor;
			let houseSpeeches: number = p.houseSpeeches! / divisor;

			return {
				name,
				houseContributed,
				houseVotes,
				oralQuestions,
				writtenQuestions,
				houseSpeeches,
				uri,
			};
		}
	);

	return (
		<TableContainer
			component={Paper}
			sx={{ p: 0.8, display: 'flex', flexDirection: 'column' }}>
			<Table aria-label='record table' sx={{ p: 0, flexDirection: 'column' }}>
				<TableHead>
					<TableRow>
						<StyledTableCell>{/* <DropDownSelect /> */}</StyledTableCell>
						<StyledTableCell align='center'>Days Contributed</StyledTableCell>
						<StyledTableCell align='center'>Votes</StyledTableCell>
						{/* <StyledTableCell align='center'>Committee</StyledTableCell> */}
						<StyledTableCell align='center'>Oral Qs</StyledTableCell>
						<StyledTableCell align='center'>Written Qs</StyledTableCell>
						<StyledTableCell align='center'>Speeches</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<StyledTableRow key={row.name}>
							<StyledTableCell component='th' scope='row'>
								<Link href={row.uri}>{row.name}</Link>
							</StyledTableCell>
							<StyledTableCell align='center'>
								{Math.ceil(row.houseContributed)}%
							</StyledTableCell>

							{/* <StyledTableCell align='center'>
								{row.committeePresent /
									row.committeeAbsent}
							</StyledTableCell> */}
							<StyledTableCell align='center'>
								{Math.ceil(row.oralQuestions)}
							</StyledTableCell>
							<StyledTableCell align='center'>
								{Math.ceil(row.writtenQuestions)}
							</StyledTableCell>
							<StyledTableCell align='center'>
								{Math.ceil(row.houseSpeeches)}
							</StyledTableCell>
							<StyledTableCell align='center'>
								{Math.ceil(row.houseVotes)}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
			<small>
				* Perecentages refer to days where TD has participated by making
				acontribution, asked a question or voted.
			</small>
		</TableContainer>
	);
}
