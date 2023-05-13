/** @format */

import { startsWithNumber } from '@/Functions/Util/strings';
import axios from 'axios';
import * as cheerio from 'cheerio';

type House = {
	dailNo: number;
	dailName: string;
	seanadNo: number;
	seanadName: string;
};

type Committee = {
	name: string;
	uri: string;
	url: string;
} & House;

// Get and return the list of committees on Oireachtas Committees page
export default async function getCommitteesBaseDetails(): Promise<Committee[]> {
	const url = 'https://www.oireachtas.ie/en/committees/';
	const oirUrl = 'https://www.oireachtas.ie';

	const response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	const $ = cheerio.load(response);

	const houses: House[] = [];
	const committees: Committee[] = [];

	// Get values
	$('option').each((index, element) => {
		const name = $(element).text().trim();
		const value = $(element).val()?.toString();

		if (!value) return; // No value, no point

		if (!startsWithNumber(name)) {
			const com: Committee = {
				name,
				uri: value!
					.replace(/^\/en\/committees\/(\d{1,2})\//, '')
					.replace(/\/$/, ''),
				url: oirUrl + value!,
				seanadName: '',
				seanadNo: 0,
				dailNo: parseInt(value!.match(/\d+/)?.[0].toString()!),
				dailName: '',
			};
			committees.push(com);
		} else {
			const [dailName, seanadName] = name.split('/').map((s) => s.trim());
			const dailNo = parseInt(dailName!.match(/\d+/)?.toString()!);
			const seanadNo = parseInt(seanadName!.match(/\d+/)?.toString()!);
			console.log;
			const tempHouse: House = {
				dailName: dailName,
				dailNo,
				seanadName: seanadName,
				seanadNo,
			};
			houses.push(tempHouse);
		}

		for (let c of committees) {
			for (let h of houses) {
				if (c.dailNo === h.dailNo) {
					c.dailName = h.dailName;
					c.seanadNo = h.seanadNo;
					c.seanadName = h.seanadName;
				}
			}
		}
	});

	console.log(committees);

	return committees;
}
