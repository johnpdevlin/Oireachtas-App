/** @format */

import {
	getStringAfterFirstTargetPoint,
	getStringBeforeFirstTargetPoint,
} from '@/functions/_utils/strings';

export function parseAndFormatDirectorships(
	properties: {
		text: string;
		otherInfo?: string;
	}[]
) {
	return properties.map((prop) => {
		return processIndividualDirectorship(prop.text, prop.otherInfo);
	});
}

function processIndividualDirectorship(text: string, otherInfo?: string) {
	if (text.endsWith('.')) text = text.slice(0, text.length - 1);
	if (text.endsWith(',')) text = text.slice(0, text.length - 1);
	if (text.endsWith(';')) text = text.slice(0, text.length - 1);
	if (text.startsWith('no ')) text = getStringAfterFirstTargetPoint(text, '.');
	// No directorships of ordinary companies.  Chairperson of Kilcolumb GWS
	const split = text.split(':');
	// CHECK FOR 2 : and 3 :
	if (split.length === 3) {
		let [position, address, description] = split;

		let organisation: string | undefined = undefined;

		if (position.includes(',')) [position, organisation] = position.split(',');
		if (organisation! && isDirectorshipTitle(organisation!))
			[organisation, position] = split[0].split(',');
		if (!isDirectorshipTitle(position)) {
			// no organisation
			position = '';
		}
		// check director doesn't come last
		// check includes director etc.
		// check for in/of titles
		if (!organisation) organisation = address.split(',')[0];
		if (organisation && address.includes(organisation))
			address = address.replace(organisation, '').replace(',', '').trim();
		if (
			(position.includes(' of ') &&
				!position.endsWith('committee') &&
				!position.endsWith('the board')) ||
			position.includes(' in ')
		) {
			if (
				position.includes('Oireachtas Commission') &&
				position.includes('Member')
			) {
				position = 'Board member';
				(organisation = 'Oireachtas Commission'),
					(address = 'Dáil Éireann, Leinster House, Kildare Street, D2'),
					(description = 'Running of the Houses of the Oireachtas.');
			} else if (position.includes(' an ') || position.includes(' a ')) {
				if (position.includes(' of '))
					position = getStringBeforeFirstTargetPoint(position, ' of ');
				else if (position.includes(' in '))
					position = getStringBeforeFirstTargetPoint(position, ' in ');
			} else {
				let temp;
				if (position.includes(' of '))
					[position, temp] = position.split(' of ');
				else if (position.includes(' in '))
					[position, temp] = position.split(' in ');
				address = `${organisation}, ${address}`;
				organisation = temp;
				if (organisation && address.includes(organisation))
					address.replace(organisation, '');
			}
		}

		if (address.split(',')[0].length > 30 && address.includes('this ')) {
			let temp = address.split(',')[0];
			address = address.replace(temp, '').replace(',', '');

			description = `${description ? `${description}.` : ''} ${temp.trim()}`;
		}
		console.info(
			'position: ',
			position,
			'\n',
			'organisation: ',
			organisation,
			'\n',
			'address: ',
			address,
			'\n',
			'description:',
			description,
			'\n',
			'other: ',
			otherInfo
		);
	} else if (split.length === 2) {
		// let [address, description] = split;
		// const organisation = address.split(',')[0];
		// if (organisation) address = address.replace(organisation, '');
		// console.info(
		// 	'organisation: ',
		// 	organisation,
		// 	'\n',
		// 	'address: ',
		// 	address,
		// 	'\n',
		// 	'description:',
		// 	description,
		// 	' ',
		// 	otherInfo
		// );
		// const processedAddress = processAddress(address);
		// if (processedAddress!)
		// 	return {
		// 		...processedAddress,
		// 		otherInfo: otherInfo,
		// 		exception: false,
		// 		description: description,
		// 	};
	} else if (split.length === 4) {
	} else {
		// console.info(split);
		// const processedAddress = processAddress(text);
		// if (processedAddress!)
		// 	return {
		// 		...processedAddress,
		// 		otherInfo: otherInfo,
		// 		exception: false,
		// 	};
		// return { text: text, address: '', otherInfo: otherInfo, exception: true };
	}
}

const isDirectorshipTitle = (title: string): Boolean => {
	title = title.toLowerCase();
	if (
		title.includes('director') ||
		title.includes('chair') ||
		title.includes('executive') ||
		title.includes('member') ||
		title.includes('stiúrthóire') ||
		title.includes('partnership')
	)
		return true;
	else return false;
};
