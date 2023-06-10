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

export type BaseCommittee = {
	name: string;
	uri: string;
	url: string;
} & House;

// Get and return the list of committees on Oireachtas Committees page
export default async function scrapeCommitteesBaseDetails(): Promise<
	BaseCommittee[]
> {
	try {
		const url = 'https://www.oireachtas.ie/en/committees/';
		const oirUrl = 'https://www.oireachtas.ie';

		// Fetch the webpage content
		const response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
		const $ = cheerio.load(response);

		const houses: House[] = [];
		const committees: BaseCommittee[] = [];

		// Iterate over the option elements and extract committee details
		$('option').each((index, element) => {
			const name = $(element).text().trim();
			const value = $(element).val()?.toString();

			if (!value) return; // Skip if value is missing

			if (!startsWithNumber(name)) {
				// Committee name does not start with a number
				const com: BaseCommittee = {
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
				// Committee name starts with a number
				const [dailName, seanadName] = name.split('/').map((s) => s.trim());
				const dailNo = parseInt(dailName!.match(/\d+/)?.toString()!);
				const seanadNo = parseInt(seanadName!.match(/\d+/)?.toString()!);

				const tempHouse: House = {
					dailName: dailName,
					dailNo,
					seanadName: seanadName,
					seanadNo,
				};
				houses.push(tempHouse);
			}

			// Match committees with their corresponding houses
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

		return committees; // Return the list of committees
	} catch (error) {
		console.error(error);
		throw error;
	}
}
