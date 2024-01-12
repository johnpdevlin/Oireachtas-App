/** @format */

import axios from 'axios';

export default async function fetchNames(
	gender: string
): Promise<Record<number, string>> {
	switch (gender) {
		case 'boy':
			return await fetchBoyNames();
		case 'girl':
			return await fetchGirlNames();
		default:
			return {};
	}
}

async function fetchGirlNames(): Promise<Record<number, string>> {
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA60/JSON-stat/1.0/en`;
	try {
		const response = await axios.get(url);
		const results = response.data.results;

		return results
			? makeLowerCase(results.dataset.dimension.C02514V04120.category.label)
			: {};
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
		return {};
	}
}

async function fetchBoyNames(): Promise<Record<number, string>> {
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA50/JSON-stat/2.0/en`;
	try {
		const response = await axios.get(url);
		const results = response.data.results;

		return results
			? makeLowerCase(results.dataset.dimension.C02512V04117.category.label)
			: {};
	} catch (error) {
		console.error(`Error fetching data from URL: ${url}`, error);
		return {};
	}
}

function makeLowerCase(obj: Record<number, string>): Record<number, string> {
	const newObj: Record<number, string> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			newObj[Number(key)] = obj[key].toLowerCase();
		}
	}
	return newObj;
}
