/** @format */

import React from 'react';
import { Chart } from 'react-google-charts';

export default function ParticipationPie() {
	const data = [
		['Task', 'Hours per Day'],
		['Work', 11],
		['Eat', 2],
	];

	const options = {
		title: '',
		is3D: true,
	};

	return (
		<Chart
			chartType='PieChart'
			data={data}
			options={options}
			width={'100%'}
			height={'50px'}
		/>
	);
}
