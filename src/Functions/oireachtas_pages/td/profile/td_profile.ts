/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import he from 'he';
import { extractWebsiteDomainName } from '@/functions/_utils/strings';
import { MemberOirProfileData } from '@/models/member/oir_profile';

export type WebsitePair = { website: string | undefined; url: string };

export default async function scrapeMemberOirProfile(
	uri: string
): Promise<MemberOirProfileData | undefined> {
	try {
		const url = `https://www.oireachtas.ie/en/members/member/${uri}`;
		const response = he.decode(
			(await axios.get(`api/webscrape?url=${url}`)).data.text
		);
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
			uri,
			address,
			contactNumbers,
			email,
			webpages: formatWebpages(webpages, uri),
		};
	} catch (e) {
		console.error(e);
		return undefined;
	}
}

function formatWebpages(webpages: string[], uri: string): WebsitePair[] {
	const name = uri.split('-')[0];

	return webpages.map((page: string) => {
		return {
			website: extractWebsiteDomainName(page, name)?.toLowerCase(),
			url: page,
		} as WebsitePair;
	});
}
