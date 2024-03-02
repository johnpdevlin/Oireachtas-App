/** @format */

import { normaliseString } from '@/functions/_utils/strings';
import axios from 'axios';

export default async function fetchNames(
	gender: 'boy' | 'girl'
): Promise<string[]> {
	switch (gender) {
		case 'boy':
			return await fetchBoyNames();
		case 'girl':
			return await fetchGirlNames();
		default:
			return [];
	}
}

async function fetchGirlNames(): Promise<string[]> {
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA60/JSON-stat/1.0/en`;
	try {
		const response = await axios.get(url);

		const results = response.data.dataset.dimension.C02514V04120.category.label;

		const names = (Object.values(results) as string[]).map((name) =>
			normaliseString(name)
		);
		return names;
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
		return [];
	}
}

async function fetchBoyNames(): Promise<string[]> {
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA50/JSON-stat/2.0/en`;
	try {
		const response = await axios.get(url);
		const results = await response.data.dimension.C02512V04117.category.label;
		const names = (Object.values(results) as string[]).map((name) =>
			normaliseString(name)
		);

		return names;
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
		return [];
	}
}
