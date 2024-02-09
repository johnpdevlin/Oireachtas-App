/** @format */

import { SittingDaysRecord } from '@/models/attendance';
import axios from 'axios';
import he from 'he';
import parseMemberBlock from './parse_member_block';

export default async function parseSittingDaysPDF(
	url: string
): Promise<SittingDaysRecord[]> {
	return axios
		.get(`api/pdf2text?url=${url}`)
		.then((response) => {
			const matches = url.match(/\/(\d{4})\//);
			const year = matches && matches[1]; // finds year
			const text = he.decode(response.data.text);

			// split by delimiter to create array of member blocks
			const blocks = text.split('Member Sitting Days Report');

			// Parse blocks to get individual member attendance records
			const reports = blocks
				.map((block: string) => {
					const parsed = parseMemberBlock(block);
					if (!parsed) {
						console.warn('the following block may need investigated:', parsed); // a sort of error message
					} else if (parsed!) {
						// Constructs the SittingDaysReport object for each block
						return { ...parsed, url: url, year: parseInt(year!) };
					}
				})
				.filter(Boolean) as SittingDaysRecord[];

			return reports;
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			return [];
		});
}
