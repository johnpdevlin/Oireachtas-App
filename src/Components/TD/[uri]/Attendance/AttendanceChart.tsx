/** @format */

import { Suspense, useEffect, useState } from 'react';
import { AttendanceRecord } from '@/models/attendance';
import { GroupType, URIpair } from '@/models/_utils';
import { LineChart } from '@mui/x-charts';
import { Breakpoint, Skeleton } from '@mui/material';

type AttendanceChartProps = {
	breakpoint: Breakpoint;
	sidebarWidth?: number;
	data: Record<GroupType, AttendanceRecord[]>;
	chartType: GroupType;
	keys: (URIpair & { color?: string })[];
	year: string;
};
export default function AttendanceChart({
	breakpoint,
	sidebarWidth,
	data,
	chartType,
	keys,
	year,
}: AttendanceChartProps) {
	const [chartWidth, setChartWidth] = useState<number>(0);
	const [chartHeight, setChartHeight] = useState<number>(0);

	// Labels for x axis (i.e. years / months)
	const [labels, setLabels] = useState<number[]>([]);
	const [seriesData, setSeriesData] = useState<
		{ label: string; data: number[]; color?: string }[]
	>([]);

	useEffect(() => {
		let relativeWidth = 0;
		let heightMutiplier = 0.35;

		if (breakpoint === 'xl') relativeWidth = 1200 - sidebarWidth!;
		else if (breakpoint === 'lg') relativeWidth = 1050 - sidebarWidth!;
		else if (breakpoint === 'md') relativeWidth = 880 - sidebarWidth!;
		else if (breakpoint === 'sm') relativeWidth = 595;
		else if (breakpoint === 'xs') {
			relativeWidth = 380;
			heightMutiplier = 0.45;
		}
		setChartWidth(relativeWidth);
		setChartHeight(relativeWidth * heightMutiplier);
	}, [breakpoint]);

	// If select changes, updates data states
	useEffect(() => {
		if (data) {
			if (year === '0') {
				setLabels(getYearLabels(data));
				setSeriesData(getOverallSeriesData(data));
			} else if (data && year !== '0') {
				const yearData = getYearSeriesData(year, data);
				if (yearData[0] && yearData[0]?.data?.length > 0)
					setSeriesData(yearData!);
				else setSeriesData([]);
				setLabels(getMonthLabels(data));
			}
		}
	}, [data, year]);

	function getYearLabels(
		data: Record<GroupType, AttendanceRecord[]>
	): number[] {
		return data[chartType]
			.filter((d) => d.present.flat().filter(Boolean).length > 0)
			.map((d) => d.year!)
			.sort()
			.map((d) => d);
	}

	function getMonthLabels(
		data: Record<GroupType, AttendanceRecord[]>
	): number[] {
		const yearData = data[chartType].find((dat) => dat.year === parseInt(year));
		if (!yearData) return []; // Return empty array if no data for selected year

		const months = yearData.present_percentage?.overall
			? yearData.present_percentage?.months
			: [];
		const relevantMonths: number[] = [];
		months.forEach((value: number | undefined | null, index: number) => {
			if (value !== undefined && value !== null) relevantMonths.push(index + 1);
		});

		return relevantMonths;
	}
	function getYearSeriesData(
		year: string,
		data: Record<GroupType, AttendanceRecord[]>
	) {
		const memberData = data[chartType].find(
			(dat) => dat.year === parseInt(year)
		);
		if (!memberData) return []; // Return empty array if no data for selected year

		const monthData = memberData.present_percentage?.months || [];
		const relevantMonths: number[] = [];
		monthData.forEach((value: number, index: number) => {
			if (value !== undefined && value !== null) relevantMonths.push(index + 1);
		});

		return keys
			.map((key) => {
				const groupData =
					data[key.uri as GroupType] &&
					data[key.uri as GroupType].find((dat) => dat.year === parseInt(year));
				if (!groupData) return undefined; // Return empty data array if no data for selected year

				const groupMonthData = groupData.present_percentage?.months || [];
				const relevantData: number[] = relevantMonths.map((month) => {
					return groupMonthData[month - 1] !== undefined &&
						groupMonthData[month - 1] !== null
						? Number(groupMonthData[month - 1]?.toFixed(1))
						: 0;
				});

				if (relevantData.length < relevantMonths.length) return undefined;
				return {
					label: key.name,
					data: relevantData,
					color: key.color ?? undefined,
				};
			})
			.filter(Boolean);
	}

	// If Overall, resets data to aggregated years
	function getOverallSeriesData(data: Record<GroupType, AttendanceRecord[]>) {
		let seriesData = data;
		const years = getYearLabels(seriesData);
		const memLength = seriesData.member.length;
		if (seriesData.constituency! && memLength > seriesData.constituency.length)
			delete seriesData.constituency;
		if (seriesData.party! && memLength > seriesData.party.length)
			delete seriesData.party;
		return Object.values(seriesData).map((value: AttendanceRecord[]) => {
			const length = seriesData[chartType].length;
			const key =
				chartType === 'member'
					? keys.find((key) => key.uri === value[0].group_type)
					: keys.find((key) => key.uri === value[0].uri);

			return {
				label: key!.name,
				data: value
					.filter(
						(val) =>
							val.present_percentage?.overall! && years.includes(val.year!)
					)
					.toSorted((a, b) => a.year! - b.year!)
					.map((val) => Number(val.present_percentage?.overall?.toFixed(1))),
				color: key?.color,
			};
		});
	}

	return (
		<>
			<Suspense
				fallback={
					<Skeleton
						variant='rectangular'
						width={chartWidth}
						height={chartHeight}
					/>
				}>
				<LineChart
					width={chartWidth}
					height={chartHeight}
					series={seriesData}
					legend={{
						hidden: true,
					}}
					margin={{ top: 25 }}
					yAxis={[
						{
							label: '%',
							max: 100,
							maxTicks: 10,
						},
					]}
					xAxis={[
						{
							label: year === '0' ? 'Years' : `Months (${year})`,
							scaleType: year === '0' ? 'point' : undefined,
							data: labels,
							min: year != '0' ? 1 : labels.at(0),
							max: year != '0' ? 12 : labels.at(-1),
							minTicks: year != '0' ? 12 : labels.at(-1)! - labels.at(0)!,
							maxTicks: year != '0' ? 12 : labels.at(-1)! - labels.at(0)!,
						},
					]}
				/>
			</Suspense>
		</>
	);
}
