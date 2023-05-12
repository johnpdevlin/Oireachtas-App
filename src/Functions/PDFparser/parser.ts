/** @format */
import { readFileSync } from 'fs';
import pdf from 'pdf-parse';

export default function parsePDF(url: string) {
	let dataBuffer: Buffer = readFileSync(url);

	pdf(dataBuffer)
		.then(function (data) {
			console.log(data.info);
		})
		.catch(function (error) {
			// handle exceptions
		});
}
