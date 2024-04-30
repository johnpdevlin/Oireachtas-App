/** @format */

import { SocialMediaType } from '@/models/_utils';

export function extractWebsiteDomainName(
	url: string,
	firstName?: string
): string | undefined {
	const regex = /^(?:https?:\/\/)?(?:www\.)?([^./]+)/i;
	const match = url.match(regex);
	const expectedWebsites = Object.keys(
		{} as { [K in SocialMediaType]: never }
	) as SocialMediaType[];

	if (match && match[1]) {
		const socialMediaFound = expectedWebsites.find((ew) =>
			url.toLowerCase().includes(ew)
		);
		if (socialMediaFound!) return match[1];
		else if (isPartyWebsite(url)!) return 'party';
		else if (firstName! && match![1].includes(firstName.toLowerCase()))
			// Check if its possibly a personal page
			return 'personal';
		if (url.includes('/ie.')) {
			const newURL = url.replace('ie.', '');
			return extractWebsiteDomainName(newURL);
		}
		if (match) return match[1];
	}

	return undefined;
}

export const isPartyWebsite = (website: string): boolean => {
	const possibleParties = [
		'sinnfein',
		'finegael',
		'fiannafail',
		'pbp',
		'greenparty',
		'labour',
		'socialdemocrats',
		'letusrise',
		'solidarity',
		'independentireland',
		'aontu',
		'righttochange',
		'hdalliance',
		'anrabhartaglas',
		'wuag',
		'workersparty',
		'republicansinnfein',
	];

	if (possibleParties.includes(website)) return true;
	else return false;
};

export function formatURL(url: string) {
	// Check if the URL already starts with a protocol (e.g., http:// or https://)
	if (!/^https?:\/\//i.test(url)) {
		// If not, prepend 'http://' to the URL
		url = 'https://' + url;
	}
	return url;
}
