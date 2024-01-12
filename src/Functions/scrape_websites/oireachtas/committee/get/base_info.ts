/** @format */

import { startsWithNumber } from '@/functions/_utils/strings';
import axios from 'axios';
import * as cheerio from 'cheerio';

type House = {
	dailNo: number;
	dailName: string;
	seanadNo: number;
	seanadName: string;
};

export type BaseCommittee = {
	name: string;
	uri: string;
	url: string;
} & House;

export default async function scrapeCommitteesBaseDetails(): Promise<
	BaseCommittee[]
> {
	try {
		const url = 'https://www.oireachtas.ie/en/committees/';
		const response = await axios.get(`api/webscrape?url=${url}`);
		const $ = cheerio.load(response.data.text);
		return parseCommitteeBaseDetails($);
	} catch (error) {
		console.error('Error scraping committee base details:', error);
		throw error;
	}
}

function parseCommitteeBaseDetails($: cheerio.CheerioAPI): BaseCommittee[] {
	const committees: BaseCommittee[] = [];
	const houses: House[] = [];
	const oirUrl = 'https://www.oireachtas.ie';

	$('option').each((_, element) => {
		const name = $(element).text().trim();
		const value = $(element).val()?.toString();

		if (!value) return;

		if (isCommittee(name)) {
			const committee = createCommittee(name, value, oirUrl);
			committees.push(committee);
		} else {
			const house = createHouse(name);
			houses.push(house);
		}
	});

	matchCommitteesWithHouses(committees, houses);
	return committees;
}

function isCommittee(name: string): boolean {
	return !startsWithNumber(name);
}

function createCommittee(
	name: string,
	value: string,
	oirUrl: string
): BaseCommittee {
	return {
		name,
		uri: value.replace(/^\/en\/committees\/(\d{1,2})\//, '').replace(/\/$/, ''),
		url: oirUrl + value,
		seanadName: '',
		seanadNo: 0,
		dailNo: parseInt(value.match(/\d+/)?.[0].toString()!),
		dailName: '',
	};
}

function createHouse(name: string): House {
	const [dailName, seanadName] = name.split('/').map((s) => s.trim());
	return {
		dailName,
		dailNo: parseInt(dailName.match(/\d+/)?.toString()!),
		seanadName,
		seanadNo: parseInt(seanadName.match(/\d+/)?.toString()!),
	};
}

function matchCommitteesWithHouses(
	committees: BaseCommittee[],
	houses: House[]
) {
	committees.forEach((committee) => {
		houses.forEach((house) => {
			if (committee.dailNo === house.dailNo) {
				committee.dailName = house.dailName;
				committee.seanadNo = house.seanadNo;
				committee.seanadName = house.seanadName;
			}
		});
	});
}
