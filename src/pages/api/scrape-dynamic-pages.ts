/** @format */

import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

/**
 * Handler function that accepts a Next.js API request and response object.
 * Retrieves sitting day reports for a specified chamber.
 * @param req Next.js API request object
 * @param res Next.js API response object
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Extract the URL from the query parameter
	const url = req.query.url as string;

	// Create a Puppeteer browser instance
	let browser;
	try {
		browser = await puppeteer.launch();

		// Create a new page and navigate to the specified URL
		const page = await browser.newPage();
		await page.goto(url);

		// Get the HTML content of the page
		const html = await page.content();

		// Return the processed HTML as a response
		res.status(200).json({
			message: 'HTML processed successfully',
			text: html.toString(),
		});
	} catch (err) {
		console.log('Scrape failed', err);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		// Close the Puppeteer browser instance
		await browser?.close();
	}
}
