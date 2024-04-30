/** @format */
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttendanceChart from '@/Components/TD/[uri]/Attendance/AttendanceChart';
import { MemberPageBioData } from '@/models/pages/member/member';
import { useViewport } from '@/hooks/viewportProvider';
import { PartyCode } from '@/models/_utils';
import ColoredBox from '@/Components/_utils/ColoredBox';
import GroupedSelect from '@/Components/_utils/Select/GroupedSelect';
import { useEffect, useState } from 'react';
import { AttendanceData } from '@/models/pages/attendance';
import { getPartyColor } from '@/functions/_utils/parties';

type SectionProps = {
	bio: MemberPageBioData;
	attendance: AttendanceData;
};

export default function AttendanceSection({ bio, attendance }: SectionProps) {
	const membershipKeys = [
		{ uri: 'member', name: bio.fullName, color: '#FF1493' },
		{
			uri: 'party',
			name: bio.parties[0].name,
			color: getPartyColor(bio.parties[0].uri as PartyCode),
		},
		{
			uri: 'constituency',
			name: bio.constituencies.dail![0].name,
			color:
				bio.constituencies.dail![0].uri ===
				('Independents_4_Change' || 'Workers_and_Unemployed_Action')
					? '#4fc3f7'
					: '#ffb74d',
		},
		{ uri: 'dail', name: 'Dáil', color: '#000000' },
	];

	const groupings = () => {
		const groupingsObj = [];
		const years: number[] = [];
		[...attendance.house.member, ...attendance.committee.member].forEach(
			(member) => {
				if (member.year && !years.includes(member.year!)) {
					years.push(member.year!);
				}
			}
		);

		const dail33 = {
			category: '33rd Dáil',
			groups: years
				.filter((year) => year! >= 2020 && year! < 2025)
				.sort((a, b) => a - b)
				.map((year) => {
					return { label: year.toString()!, value: year! };
				}),
		};
		const dail32 = {
			category: '32nd Dáil',
			groups: years
				.filter((year) => year! < 2020)
				.sort((a, b) => a - b)
				.map((year) => {
					{
						return { label: year?.toString()!, value: year! };
					}
				}),
		};
		dail32.groups.length > 0 && groupingsObj.push(dail32);
		dail33.groups.length > 0 && groupingsObj.push(dail33);

		return groupingsObj;
	};

	const [year, setYear] = useState<string>('0');
	const { breakpoint } = useViewport();

	const [sidebarWidth, setSidebarWidth] = useState(0);
	const [sidebarDirection, setSidebarDirection] = useState<
		'column' | 'row' | 'row-reverse'
	>('column');
	const [legendDirection, setLegendDirection] = useState<
		'column' | 'row' | 'row-reverse'
	>('column');

	useEffect(() => {
		const element = document.getElementById('chart-sidebar');
		if (element) {
			const width = element.offsetWidth;
			setSidebarWidth(width);
		}
	}, []);

	useEffect(() => {
		if (breakpoint === 'xs' || breakpoint === 'sm') {
			setSidebarDirection('row-reverse');
			setLegendDirection('row');
		} else if (
			breakpoint === 'md' ||
			breakpoint === 'lg' ||
			breakpoint === 'xl'
		) {
			setSidebarDirection('column');
			setLegendDirection('column');
		}
	}, [breakpoint]); // Empty dependency array ensures that this effect runs only once after initial render

	const LegendComponent = () => {
		return (
			<Stack flexDirection={legendDirection} margin={2}>
				{membershipKeys.map((key) => {
					return (
						<Stack
							direction='row'
							display='flex'
							alignItems='center'
							textOverflow='ellipsis '
							key={key.uri}>
							<ColoredBox color={key.color} size={'18px'} />
							<Typography variant='body2'>{key.name}</Typography>
						</Stack>
					);
				})}
			</Stack>
		);
	};

	return (
		<>
			<Grid
				container
				display='flex'
				justifyContent='space-evenly'
				flexDirection='row-reverse'>
				<Grid item display='flex' alignItems='start'>
					<Stack flexDirection={sidebarDirection} gap={2} id={'chart-sidebar'}>
						<GroupedSelect
							label={'Period'}
							groupings={groupings()}
							value={year}
							setValue={setYear}
							overall={'Overall'}
						/>
						<Box
							sx={{
								display: {
									xs: 'none',
									sm: 'block',
									md: 'block',
									lg: 'block',
									xl: 'block',
								},
							}}>
							{LegendComponent()}
						</Box>
					</Stack>
				</Grid>
				<Grid item>
					<Stack direction='column' gap={5} alignItems='center'>
						{attendance.house.member.length > 0 && (
							<Box>
								<Stack direction='column'>
									<Typography variant='h4' textAlign='center'>
										House Attendance
									</Typography>
									<AttendanceChart
										breakpoint={breakpoint!}
										sidebarWidth={sidebarWidth}
										data={attendance.house}
										chartType={'member'}
										keys={membershipKeys}
										year={year}
									/>
								</Stack>
							</Box>
						)}
						{attendance.committee.member.length > 0 && (
							<Box>
								<Stack direction='column'>
									<Typography variant='h4' textAlign='center'>
										Committee Attendance
									</Typography>
									<AttendanceChart
										breakpoint={breakpoint ?? 'xs'}
										sidebarWidth={sidebarWidth}
										data={attendance.committee}
										chartType={'member'}
										keys={membershipKeys}
										year={year}
									/>
								</Stack>
							</Box>
						)}
					</Stack>
				</Grid>
				<Box
					sx={{
						display: {
							xs: 'block',
							sm: 'none',
							md: 'none',
							lg: 'none',
							xl: 'none',
						},
						alignItems: 'center',
					}}
					margin={1}>
					{LegendComponent()}
				</Box>
			</Grid>
		</>
	);
}
