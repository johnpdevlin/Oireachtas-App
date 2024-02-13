/** @format */
import * as cheerio from 'cheerio';
import { strMonthToNumber } from '@/functions/_utils/dates';

function getDateRange($: cheerio.CheerioAPI) {
	let dateRange: { start: Date; end: Date | undefined } = {
		start: new Date('2099-12-01'),
		end: undefined,
	};

	const dateDetails = $('.c-committee-summary__meta-item').each(
		(_index: number, element: cheerio.Element) => {
			const text = $(element).text().trim();
			if (text.includes('established')) {
				dateRange.start = formatDate(text.split(':')[1].trim());
			} else if (text.includes('dissolved')) {
				dateRange.end = formatDate(text.split(':')[1].trim());
			} else if (text.includes('House')) {
				// if (text.includes('Dáil')) chamber = 'dail';
				// if (text.includes('Seanad')) chamber = 'seanad';
			}
		}
	);

	return dateRange;
}

function formatDate(date: string): Date {
	const [day, month, year] = date.split(' ');
	return new Date(`${year}-${strMonthToNumber(month)! + 1}-${day}`);
}

export { getDateRange };
