/** @format */

import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

import { Chamber } from '@/Models/_utility';

/**
 * Handler function that accepts a Next.js API request and response object.
 * Retrieves sitting day reports for a specified chamber.
 * @param req Next.js API request object
 * @param res Next.js API response object
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Won't work for this use case as website not behaving as expected

	res.status(200).json({
		message: 'API not available',
	});
	// Extract the URL from the query parameter
	const chamber = req.query.chamber as string;
	const house_no = req.query.house_no as string;

	// Create a Puppeteer browser instance
	let browser;
	try {
		browser = await puppeteer.launch({ headless: 'new' });

		// Create a new page and navigate to the specified URL
		const page = await browser.newPage();

		// Adjust viewport to emulate desktop view
		await page.setViewport({ width: 1366, height: 768 });

		await page.goto('https://www.oireachtas.ie/en/publications/');

		// published by {chamber}
		// await page.waitForSelector('#desktop-author-dail-eireann');
		// await page.click('#desktop-author-dail-eireann');

		// Select when published type
		// await page.waitForSelector('#date-term-desktop');
		// await page.click('#date-term-desktop');

		// const selectSelector = '.c-publications-filter__terms-select select';
		// const optionValue = '/ie/oireachtas/house/dail/33';

		// await page.evaluate(
		// 	(selectSelector, optionValue) => {
		// 		const selectElement = document.querySelector(selectSelector);
		// 		const optionElement = selectElement?.querySelector(
		// 			`option[value="${optionValue}"]`
		// 		) as HTMLOptionElement; // Explicit typecasting to HTMLOptionElement
		// 		optionElement.selected = true;
		// 		selectElement?.dispatchEvent(new Event('change'));
		// 	},
		// 	selectSelector,
		// 	optionValue
		// );

		// Filter by category (record of attendance)
		// const checkboxSelector = '#desktop-topic-record-of-attendance';
		// await page.click(checkboxSelector);

		await page.waitForNavigation({ timeout: 30000 });
		// Wait for the target element to be visible
		try {
			await page.waitForSelector('div.c-publications-list');
		} catch (error) {
			console.log('Error waiting for selector:', error);
			throw error; // Rethrow the error to be caught in the catch block below
		}
		// Scrape href and title attributes from <a> tags within the target <div>
		const scrapedData = await page.evaluate(() => {
			const links = Array.from(
				document.querySelectorAll('div.c-publications-list a') // Removed unnecessary space before class name
			);
			return links.map((link) => ({
				href: link.getAttribute('href'),
				title: link.getAttribute('title'),
			}));
		});

		// Return the scraped data as a response
		res.status(200).json({
			message: 'Data scraped successfully',
			data: scrapedData,
		});
	} catch (err) {
		console.log('Scrape failed', err);
		res.status(500).json({ message: 'Internal server error' + err.message });
	} finally {
		// Close the Puppeteer browser instance
		await browser?.close();
	}
}
