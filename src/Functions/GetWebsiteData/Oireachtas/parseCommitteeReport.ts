/** @format */

import { capitaliseFirstLetters } from '@/Functions/Util/strings';
import axios from 'axios';

// Helper function to format presence string
function formatPresence(presence: string): string {
	// Array of strings to be replaced
	const replacements: [string, string][] = [
		['*', ' '],
		['/', ''],
		[':', ''],
		['deputies', ''],
		['deputy', ''],
		['senators', ''],
		['senator', ''],
		['ministers', ''],
		['minister', ''],
		['taoiseach', ''],
		['tánaiste', ''],
		['ceann comhairle', ''],
		['teachtaí', ''],
		['dála', ''],
		['teachta', ''],
		['dáil', ''],
		['seanadóirí', ''],
		['seanadóir', ''],
		['cathaoirleach', ''],
		[' the ', ''],
		[' in ', ''],
		[' sa ', ''],
		[' í ', ''],
		['comhaltaí a bhí', ''],
		['i láthair', ''],
		[' chair ', ''],
		['chathaoir', ''],
		['\\([^)]*\\)', ''], // regex pattern to remove text between parentheses ()
	];

	let formattedPresence: string = presence;

	// Iterate over the replacements and perform string replacements
	for (const [substring, replacement] of replacements) {
		if (formattedPresence.includes(substring)) {
			formattedPresence = formattedPresence.replace(
				new RegExp(substring, 'g'),
				replacement
			);
		}
	}

	formattedPresence = capitaliseFirstLetters(formattedPresence).trim();
	return formattedPresence;
}

// Function to format present string
function formatPresentString(presence: string): string[] {
	if (presence.includes('in attendance')) {
		const present: string = presence.split(':')[1];
		return [formatPresence(present)];
	}

	if (presence.includes('and')) {
		const present: string[] = presence.split(' and ');
		return present.map((p) => formatPresence(p));
	}

	if (presence.includes('.') || presence.includes(',')) {
		const present: string[] = presence.split(/[.,]/);
		return present
			.map((p) => {
				const name: string = formatPresence(p);
				if (name !== '' && name !== undefined) {
					return name;
				}
			})
			.filter(Boolean) as string[];
	}

	return [formatPresence(presence)];
}

// Main function to parse committee report
export default async function parseCommitteeReport(
	uri: string,
	date: string
): Promise<string[] | void> {
	let temp = 'joint_committee_on_';

	if (uri.includes('select-committee')) {
		let temp = 'select_committee_on_';
	}
	if (uri.includes('irish-language')) {
		temp = 'comhchoiste_na_';
		uri = 'gaeilge_na_gaeltachta_agus_phobal_labhartha_na_gaeilge';
	} else {
		uri = uri.replaceAll(/-/g, '_');
	}
	const url: string = `https://data.oireachtas.ie/ie/oireachtas/debateRecord/${temp}${uri}/${date}/debate/mul@/main.pdf`;
	try {
		const response = await axios.get(`api/pdf2text?url=${url}`);
		const text: string = response.data.text;

		// Remove lines with page numbers
		const lines: string[] = text.split('\n');

		let searching: boolean = false;
		let present: string[] = [];
		let additionalAttendees: string[] = [];
		let areAdditional: boolean = false;

		for (let i = 0; i < lines.length; i++) {
			const line: string = lines[i].toLowerCase();

			if (line.includes('absence')) {
				searching = false;
			} else if (searching === true) {
				if (!line.includes('deputies') && !line.includes('senators')) {
					if (line.includes('in attendance') || areAdditional === true) {
						areAdditional = true;
						if (line.includes('.')) {
							areAdditional = false;
						}
						const processed: string[] = formatPresentString(line);
						additionalAttendees.push(...processed);
					} else {
						const processed: string[] = formatPresentString(line);
						present.push(...processed);
						if (line.includes('in the chair')) {
							searching = false;
							break;
						}
					}
				}
			} else if (line.includes('present')) {
				searching = true;
			}
		}

		return present;
	} catch (error) {
		console.log(error);
	}
}
