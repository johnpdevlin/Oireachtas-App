/** @format */
import * as Cheerio from 'cheerio';
import cheerio from 'cheerio';

export function parseEducationDetails(el: Cheerio.Cheerio<Cheerio.Element>) {
	const education: { name: string; wikiURI: string | undefined }[] = [];

	function addToEducation(name: string, wikiURI: string | undefined) {
		if (
			!education.some((e) => e.name === name || e.wikiURI === wikiURI) &&
			!name.includes('citation') &&
			!name.includes('#') &&
			!name.includes('[') &&
			(!wikiURI || wikiURI.includes('/wiki/')!)
		) {
			education.push({ name, wikiURI });
		}
	}

	if (el.find('ul')) {
		el.find('li').each((index, e) => {
			const li = cheerio(e);
			const name = li.text();
			const wikiURI = li.find('a').attr('href');

			addToEducation(name, wikiURI);
		});
	} else if (el.find('a')) {
		el.find('a').each((index, e) => {
			const a = cheerio(e);
			const name = a.text();

			const wikiURI = a.attr('href');
			addToEducation(name, wikiURI);
		});
	}

	const name = el.text();
	const wikiURI = el.find('a').attr('href');
	addToEducation(name, wikiURI);

	return education;
}
