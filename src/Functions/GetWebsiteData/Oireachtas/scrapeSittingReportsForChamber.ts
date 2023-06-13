/** @format */

// 	// f() to get sitting day reports for chamber i.e. Dáil 33 etc.

// 	async function run() {
// 		let browser;
// 		try {
// 			browser = await puppeteer.launch();
// 			const page = await browser.newPage();
// 			await page.goto('https://www.oireachtas.ie/en/publications/');
// 			const html = await page.content();
// 		} catch (err) {
// 			console.log('scrape failed', err);
// 		} finally {
// 			await browser?.close();
// 		}
// 	}

// 	run();
// }
