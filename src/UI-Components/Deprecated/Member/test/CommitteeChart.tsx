/** @format */

/** @format */

import { useEffect, useState } from 'react';

import { GroupType } from '@/models/_utils';
import { getUniqueYears } from '@/functions/_utils/objects';
import { DailYear, MonthChar } from '@/models/dates';
import { getMonthStrFromNumber } from '@/functions/_utils/dates';
import SelectSmall from './_smallSelect_';
import { LineChart } from '@mui/x-charts/LineChart/index.js';

export default function CommitteeAttendanceChart() {
	// data: {
	// 	name: string;
	// 	type: GroupType;
	// 	data: { year: DailYear; month: number; present: number; absent: number }[];
	// }[]
	const data: {
		name: string;
		type: GroupType;
		data: { year: DailYear; month: number; present: number; absent: number }[];
	}[] = [
		{
			name: 'Member Group',
			type: 'member',
			data: [
				{ year: 2020, month: 1, present: 100, absent: 10 },
				{ year: 2020, month: 2, present: 110, absent: 15 },
				{ year: 2021, month: 1, present: 120, absent: 5 },
				{ year: 2021, month: 2, present: 130, absent: 8 },
				// ... more data entries
			],
		},
		{
			name: 'Party Group',
			type: 'party',
			data: [
				{ year: 2020, month: 1, present: 500, absent: 30 },
				{ year: 2020, month: 2, present: 510, absent: 25 },
				{ year: 2021, month: 1, present: 520, absent: 20 },
				{ year: 2021, month: 2, present: 530, absent: 18 },
				// ... more data entries
			],
		},
		{
			name: 'Constituency Group',
			type: 'constituency',
			data: [
				{ year: 2020, month: 1, present: 200, absent: 20 },
				{ year: 2020, month: 2, present: 210, absent: 22 },
				{ year: 2021, month: 1, present: 220, absent: 18 },
				{ year: 2021, month: 2, present: 230, absent: 15 },
				// ... more data entries
			],
		},
		{
			name: 'Dail Group',
			type: 'dail',
			data: [
				{ year: 2020, month: 1, present: 800, absent: 50 },
				{ year: 2020, month: 2, present: 810, absent: 55 },
				{ year: 2021, month: 1, present: 820, absent: 40 },
				{ year: 2021, month: 2, present: 830, absent: 45 },
				// ... more data entries
			],
		},
	];
	const member = data.filter((d) => d.type === 'member')[0];
	const party = data.filter((d) => d.type === 'party')[0];
	const constituency = data.filter((d) => d.type === 'constituency')[0];
	const dail = data.filter((d) => d.type === 'dail')[0];

	const years = getUniqueYears(member.data).sort((a, b) => a - b);

	// Aggregates years, so get average across year
	const overallMember = aggregateYears(years, member);
	const overallDail = aggregateYears(years, dail);
	const overallParty = aggregateYears(years, party);
	const overallConstituency = aggregateYears(years, constituency);

	// Labels for x axis (i.e. years / months)
	const [labels, setLabels] = useState<MonthChar[] | DailYear[]>(() => years);

	// Sets initial data states
	const [memberData, setMemberData] = useState<number[]>(() => overallMember);
	const [dailData, setDailData] = useState<number[]>(() => overallDail);
	const [partyData, setPartyData] = useState<number[]>(() => overallParty);
	const [constituencyData, setConstituencyData] = useState<number[]>(
		() => overallConstituency
	);
	const [year, setYear] = useState<DailYear | 0>(() => 0);

	// Labels for select menu
	const selectLabels = [
		{ name: 'Overall', value: 0 },
		...years.map((year) => {
			return { name: year.toString(), value: year };
		}),
	];

	// If select changes, updates data states
	useEffect(() => {
		if (year === 0) setToOverall();
		else {
			setMemberData(processYears(year, member.data));
			setPartyData(processYears(year, party.data));
			setDailData(processYears(year, dail.data));
			setConstituencyData(processYears(year, constituency.data));
			const temp = member.data
				.filter((d) => d.year === year)
				.map((d) => d.month)
				.sort((a, b) => a - b);
			const tempLabels = getMonthStrFromNumber(temp);
			if (tempLabels!) setLabels(tempLabels);
		}
	}, [year]);

	// If Overall, resets data to aggregated years
	function setToOverall() {
		setMemberData(overallMember);
		setDailData(overallDail);
		setPartyData(overallParty);
		setConstituencyData(overallConstituency);
		setLabels(years);
	}
	return (
		<>
			{/* <SelectSmall
				labels={selectLabels}
				label='Period'
				state={year}
				setState={setYear}
			/>  */}
			<LineChart
				width={500}
				height={300}
				series={[
					{ data: memberData, label: member.name },
					{ data: dailData, label: dail.name },
					{ data: constituencyData, label: constituency.name },
					{ data: partyData, label: party.name },
				]}
				sx={{
					'--ChartsLegend-itemWidth': '200px',
				}}
				xAxis={[{ scaleType: 'point', data: labels }]}
			/>
		</>
	);
}

function aggregateYears(
	years: DailYear[],
	data: {
		name: string;
		type: GroupType;
		data: { year: DailYear; month: number; present: number; absent: number }[];
	}
): number[] {
	const aggregatedData: { year: DailYear; percentage: number }[] = [];

	years.forEach((year: DailYear) => {
		const yearData = data.data.filter((item) => item.year === year);
		const yearPresent = yearData.reduce((sum, item) => sum + item.present, 0);
		const yearAbsent = yearData.reduce((sum, item) => sum + item.absent, 0);

		const percentage = yearPresent / (yearPresent + yearAbsent);
		aggregatedData.push({ year, percentage: percentage });
	});

	// Sort the aggregated data by year in ascending order
	aggregatedData.sort((a, b) => a.year - b.year);

	return aggregatedData.map((agg) => agg.percentage);
}

function processYears(
	year: DailYear,
	data: { year: DailYear; month: number; present: number; absent: number }[]
): number[] {
	return data
		.filter((d) => d.year === year)
		.sort((a, b) => a.month - b.month)
		.map((mem) => mem.present / (mem.present + mem.absent));
}
