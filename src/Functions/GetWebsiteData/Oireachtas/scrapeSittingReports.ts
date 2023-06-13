/** @format */

import { Chamber } from '@/Models/_utility';
import axios from 'axios';
import * as cheerio from 'cheerio';
import parseSittingDaysReport from './parseSittingDaysPDF';

export default async function scrapeSittingReportsForChamber(
	chamber: Chamber,
	house_no: number
) {
	if (chamber === 'dail') {
		if (house_no === 33) {
			let report2020 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2021/2021-02-12_deputies-verification-of-attendance-for-the-payment-of-taa-8-feb-to-30-nov-2020_en.pdf';
			let report2021 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2022/2022-03-10_deputies-verification-of-attendance-for-the-payment-of-taa-01-jan-2021-to-31-december-2021_en.pdf';
			let report2022 =
				'https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2023/2023-03-13_deputies-verification-of-attendance-for-the-payment-of-taa-01-january-2022-to-31-december-2022_en.pdf';
			const reports = [report2020];
			const output = reports.map((report) => {
				return parseSittingDaysReport(report);
			});

			return output;
		}
	}
}
