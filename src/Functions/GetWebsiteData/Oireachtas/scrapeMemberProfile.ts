/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';

type MemberOirData = {
	address: string;
	contactNumbers: string[];
	email: string;
	webpages: string[];
};

export default async function scrapeMemberOirProfile(
	uri: string
): Promise<MemberOirData> {
	const url = `https://www.oireachtas.ie/en/members/member/${uri}`;
	const response = (await axios.get(`api/webscrape?url=${url}`)).data.text;
	const $ = cheerio.load(response);

	const address: string = $(
		'.c-member-about__address .c-member-about__item-value'
	)
		.text()
		.trim();

	const contactNumbers: string[] = $('.c-member-about__phone-numbers')
		.text()
		.trim()
		.split('\n')
		.filter((num: string) => num.trim().startsWith('('))
		.map((num: string) => num.trim());

	const email: string = $('.c-member-about__email').text().trim();

	const webpages: string[] = $('.c-member-about__web a')
		.map((i, el) => {
			return $(el).attr('href');
		})
		.get();

	return {
		address,
		contactNumbers,
		email,
		webpages,
	};
}
