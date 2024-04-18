/** @format */

type ScrapingFunction<T> = (uri: string) => Promise<T>;

export async function retryScrapingWithBackoff<T>(
	uris: string[],
	failedURIs: string[],
	scrapingFunction: ScrapingFunction<T>,
	attempt: number = 1
): Promise<T[]> {
	const MAX_RETRY_ATTEMPTS = 4;

	if (
		attempt > MAX_RETRY_ATTEMPTS ||
		(uris.length === 0 && failedURIs.length === 0)
	) {
		console.error('Max retry attempts reached or all URIs failed.');
		return [];
	}

	const initialDelay = 5000; // Initial delay before retrying failed URIs
	const retryDelay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff

	if (failedURIs.length > 0) {
		console.warn(`Failed ${failedURIs.length} URIs: ${failedURIs.join(', ')}`);
		console.info(
			`Retrying failed URIs after ${
				retryDelay / 1000
			} seconds (Attempt ${attempt})...`
		);
		await delayExecution(initialDelay);

		const newlyFailedURIs: string[] = [];

		for (const uri of failedURIs) {
			try {
				const result = await scrapingFunction(uri);
				if (!result) {
					newlyFailedURIs.push(uri);
				}
			} catch (error) {
				console.error(`Failed to scrape URI ${uri}:`, error);
				newlyFailedURIs.push(uri);
			}
		}

		// Retry newly failed URIs once after a shorter delay
		await delayExecution(retryDelay);
		return retryScrapingWithBackoff(
			[],
			newlyFailedURIs,
			scrapingFunction,
			attempt + 1
		);
	}

	if (uris.length > 0) {
		console.log(
			`Scraping remaining ${uris.length} URIs after ${
				initialDelay / 1000
			} seconds (Attempt ${attempt})...`
		);
		await delayExecution(initialDelay);

		const results: T[] = [];

		for (const uri of uris) {
			try {
				const result = await scrapingFunction(uri);
				if (result) {
					results.push(result);
				} else {
					failedURIs.push(uri);
				}
			} catch (error) {
				console.error(`Failed to scrape URI ${uri}:`, error);
				failedURIs.push(uri);
			}
		}

		if (failedURIs.length > 0)
			return retryScrapingWithBackoff(
				[],
				failedURIs,
				scrapingFunction,
				attempt + 1
			);
		else return results;
	}

	return [];
}

async function delayExecution(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}
