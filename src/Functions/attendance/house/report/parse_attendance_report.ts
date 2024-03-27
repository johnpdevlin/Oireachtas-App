/** @format */

import { SittingDaysRecord } from '@/models/attendance';
import parseMemberBlock from './parse_member_block';
import { fetchRawTextFromUrlWithRetry } from '@/functions/_utils/fetch_raw_text_from_url';

export default async function parseSittingDaysPDF(
	url: string
): Promise<SittingDaysRecord[]> {
	const text = await fetchRawTextFromUrlWithRetry(url);
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
				return { ...parsed, url: url };
			}
		})
		.filter(Boolean) as SittingDaysRecord[];

	return reports;
}
