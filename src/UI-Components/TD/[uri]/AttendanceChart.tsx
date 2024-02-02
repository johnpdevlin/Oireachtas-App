/** @format */

/** @format */

import { useEffect, useState } from 'react';

import { GroupType } from '@/models/_utils';
import { getUniqueYears } from '@/functions/_utils/objects';
import { DailYear, MonthChar } from '@/models/dates';
import { getMonthStrFromNumber } from '@/functions/_utils/dates';
import data from '@/Data/sample/attendance';
import SimpleMultiLineChart from '@/UI-Components/_utils/Chart/Line/MultiLineChart';

export default function AttendanceChart(props: {
	width: number;
	height: number;
}) {
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

	const groupings = [
		{
			category: '33rd Dáil',
			groups: [
				{
					label: '2023',
					value: 2023,
				},
				{ label: '2022', value: 2022 },
			],
		},
		{ category: 'Terms', groups: [{ label: '33rd Dáil', value: 33 }] },
	];
	return (
		<>
			<SimpleMultiLineChart
				width={1100}
				height={300}
				series={[
					{ data: memberData, label: member.name },
					{ data: dailData, label: dail.name },
					{ data: constituencyData, label: constituency.name },
					{ data: partyData, label: party.name },
				]}
				labels={labels as string[]}
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
