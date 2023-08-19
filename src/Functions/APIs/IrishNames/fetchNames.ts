/** @format */

import axios from "axios";



export default function fetchNames(gender: string) {
	// fetches all boy or girl names registered in Ireland
	switch (gender) {
		case 'boy':
			return fetchBoyNames();
		case 'girl':
			return fetchGirlNames();
	}
}

async function fetchGirlNames(): Promise<Record<number, string> | void> {
	// Construct the URL for the girl names API and make the request
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA60/JSON-stat/1.0/en`;
	try{
	const results = (await axios.get(url)).data.results;

	if (results!) {
		// Extract the names from the API response and return them
		const names = results.dataset.dimension.C02514V04120.category.label;

		return makeLowerCase(names);
	}
} catch (
	error
) {
	console.error(`Error fetching data from URL: ${url}`, error);
}
}
async function fetchBoyNames(): Promise<Record<number, string> | void> {
	// Construct the URL for the boy names API and make the request
	const url: string = `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/VSA50/JSON-stat/2.0/en`;
	try{
	const results = (await axios.get(url)).data.results;

	if (results!) {
		// Extract the names from the API response and return them
		const names = results.dimension.C02512V04117.category.label;

		return makeLowerCase(names);
	}
} catch (
	error
) {
	console.error(`Error fetching data from URL: ${url}`, error);
}

function makeLowerCase(obj: {}) {
	const newObj: Record<number, string> = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			newObj[key as unknown as number] = obj[key].toLowerCase() as string;
		}
	}
	return newObj;
}
