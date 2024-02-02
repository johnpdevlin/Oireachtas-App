/** @format */

import { LineChart } from '@mui/x-charts';

function SimpleMultiLineChart(props: {
	width: number;
	height: number;
	labels: string[];
	series: { data: number[]; label: string }[];
}) {
	return (
		<>
			<LineChart
				width={props.width}
				height={props.height}
				series={props.series}
				sx={{
					'--ChartsLegend-itemWidth': '150px',
				}}
				xAxis={[{ scaleType: 'point', data: props.labels }]}
			/>
		</>
	);
}

export default SimpleMultiLineChart;
