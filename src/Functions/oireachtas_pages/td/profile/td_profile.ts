/** @format */
import axios from 'axios';
import * as cheerio from 'cheerio';
import he from 'he';
import { extractWebsiteDomainName } from '@/functions/_utils/urls';
import { MemberOirProfileData } from '@/models/member/oir_profile';
import { WebsitePair } from '@/models/_utils';

export default async function scrapeMemberOirProfile(
	uri: string
): Promise<MemberOirProfileData | undefined> {
	const MAX_RETRY_ATTEMPTS = 5;
	const BASE_TIMEOUT_MS = 1000; // Initial timeout in milliseconds
	let retryCount = 0;
	let profileData: MemberOirProfileData | undefined = undefined;

	while (retryCount < MAX_RETRY_ATTEMPTS) {
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

			profileData = {
				uri,
				address,
				contactNumbers,
				email,
				webpages: formatWebpages(webpages, uri),
			};

			// Break out of the loop if the operation is successful
			break;
		} catch (e) {
			retryCount++;
			console.error(
				`Error scraping profile data for URI ${uri}. Retrying... (${retryCount}/${MAX_RETRY_ATTEMPTS} attempts)`
			);

			if (retryCount < MAX_RETRY_ATTEMPTS) {
				const timeoutMs = BASE_TIMEOUT_MS * Math.pow(2, retryCount);
				console.log(`Waiting ${timeoutMs / 1000} seconds before retrying...`);
				await new Promise((resolve) => setTimeout(resolve, timeoutMs));
			}
		}
	}

	if (!profileData) {
		console.error(
			`Failed to scrape profile data for URI ${uri} after ${MAX_RETRY_ATTEMPTS} attempts`
		);
	}

	return profileData;
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
