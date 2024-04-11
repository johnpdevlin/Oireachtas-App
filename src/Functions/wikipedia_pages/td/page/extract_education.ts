/** @format */
import * as cheerio from 'cheerio';
import { splitCamelCase, isAllUpperCase } from '@/functions/_utils/strings';
import { findBestMatch } from 'string-similarity';
import {
	getInfoBoxText,
	getMultipleInfoBoxHrefs,
	getInfoBoxHref,
} from '../../_utils/_utils';

// Util function to extract education types
export default function extractEducation(
	$: cheerio.CheerioAPI,
	type: 'Education' | 'Alma mater'
): { name: string; wikiURI: string | undefined }[] | undefined {
	const names = parseEduNames($, type);
	if (!names || names.length === 0) return undefined;

	const hrefs =
		names.length > 1
			? getMultipleInfoBoxHrefs($, type)
			: getInfoBoxHref($, type)
			? [getInfoBoxHref($, type)]
			: [];

	// Match edu name to wikiURI
	const matchedPairs = names.map((name) => {
		if (!hrefs) return { name, wikiURI: undefined };
		if (isAllUpperCase(name) && hrefs!) {
			const acroymn = parseAcronym(name, hrefs);
			if (acroymn) return acroymn;
		}
		const bestMatch =
			hrefs! && hrefs.length > 0
				? findBestMatch(name, hrefs).bestMatch
				: undefined;
		const wikiURI =
			bestMatch! && bestMatch?.rating > 0.3 ? bestMatch.target : undefined;
		return { name, wikiURI };
	});

	// If no wikiURI is matched
	if (type === 'Alma mater' && matchedPairs.find((p) => !p.wikiURI))
		return matchedPairs.map((p) => {
			if (!p.wikiURI) {
				// Match unmatched wikiURI if only one match
				const href = hrefs.filter((href) =>
					matchedPairs.every((p) => p.wikiURI !== href)
				);
				if (href.length === 1) return { name: p.name, wikiURI: href[0] };
				else return { name: p.name, wikiURI: undefined };
			} else return p;
		});

	return matchedPairs;
}

function parseEduNames(
	$: cheerio.CheerioAPI,
	type: 'Education' | 'Alma mater'
): string[] | undefined {
	let text = getInfoBoxText($, type);
	if (text?.includes('}')) text = text.split('}').at(-1);

	let names = text ? splitCamelCase(text) : undefined;
	if (!names) return undefined;

	type === 'Alma mater' &&
		names?.forEach((n) => {
			if (n.includes('NCAD') && n !== 'NCAD') {
				names = names?.filter((n) => !n.includes('NCAD'));
				names?.push('NCAD', n.replace('NCAD', '')!);
			}
		});

	return names;
}

function parseAcronym(name: string, hrefs: string[]) {
	// get intials from wiki URI
	const hrefInitials = hrefs.map((href) => {
		return {
			href: href,
			initial: href
				.split('/')
				.at(-1)!
				.split('_')
				.filter((href) => href !== 'of'),
		};
	});

	const letters = name.substring(0);
	const possibleMatches = hrefInitials.filter(
		(init) => init?.initial?.length === letters.length
	);
	if (possibleMatches.length === 1)
		return { name, wikiURI: possibleMatches[0].href };
	else {
		possibleMatches.forEach((possible) => {
			for (let i = 0; i < possible!.initial!.length; i++)
				if (
					possible.initial!.at(i) === letters[i] &&
					(possible.initial!.at(i + 1) !== letters[i] ||
						possible.initial!.at(i - 1) !== letters[i])
				)
					return { name, wikiURI: possible.href };
		});
	}
}
