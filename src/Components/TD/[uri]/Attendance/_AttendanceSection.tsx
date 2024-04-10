/** @format */
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttendanceChart from '@/Components/TD/[uri]/Attendance/AttendanceChart';
import { MemberPageData } from '@/models/ui/member';
import { useViewport } from '@/hooks/viewportProvider';
import { getPartyColor } from '@/functions/_utils/parties';
import { PartyCode } from '@/models/_utils';
import ColoredBox from '@/Components/_utils/ColoredBox';
import GroupedSelect from '@/Components/_utils/Select/GroupedSelect';
import { useEffect, useState } from 'react';

export default function AttendanceSection({ bio, attendance }: MemberPageData) {
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
		const years = attendance.house.member.map((member) => {
			return {
				dateRange: member.dateRange,
				year: member.year,
			};
		});

		const dail33 = {
			category: '33rd Dáil',
			groups: years
				.filter((year) => year.year! >= 2020 && year.year! > 2025)
				.map((group) => {
					return { label: group.year?.toString()!, value: group.year! };
				})
				.toSorted((a, b) => a.value - b.value),
		};
		const dail32 = {
			category: '32nd Dáil',
			groups: years
				.filter((year) => year.year! < 20202)
				.map((group) => {
					{
						return { label: group.year?.toString()!, value: group.year! };
					}
				})
				.toSorted((a, b) => a.value - b.value),
		};
		dail33.groups.length > 0 && groupingsObj.push(dail33);
		dail32.groups.length > 0 && groupingsObj.push(dail32);
		return groupingsObj;
	};

	const [year, setYear] = useState<string>('0');
	const { breakpoint } = useViewport();

	const [sidebarWidth, setSidebarWidth] = useState(0);
	const [sidebarDirection, setSidebarDirection] = useState('column');
	const [legendDirection, setLegendDirection] = useState('column');

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
			<Grid container justifyContent='space-evenly' flexDirection='row-reverse'>
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
					<Stack direction='column' gap={5}>
						<Box>
							<Stack direction='column'>
								<Typography variant='h4' textAlign='center'>
									House Attendance
								</Typography>
								<AttendanceChart
									breakpoint={breakpoint}
									sidebarWidth={sidebarWidth}
									data={attendance.house}
									chartType={'member'}
									keys={membershipKeys}
									year={year}
								/>
							</Stack>
						</Box>
						<Box>
							<Stack direction='column'>
								<Typography variant='h4' textAlign='center'>
									Committee Attendance
								</Typography>
								<AttendanceChart
									breakpoint={breakpoint}
									sidebarWidth={sidebarWidth}
									data={attendance.committee}
									chartType={'member'}
									keys={membershipKeys}
									year={year}
								/>
							</Stack>
						</Box>
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
