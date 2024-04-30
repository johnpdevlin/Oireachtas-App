/** @format */

import { BinaryChamber } from '@/models/_utils';
import { boyNameExceptions, girlNameExceptions } from './exceptions';
import fetchNames from './fetch_names';
import { handleUnisexName } from './handle_unisex';
import { Gender } from '@/models/member/_all_bio_data';

export default async function checkGender(
	firstName: string,
	boyNames?: string[],
	girlNames?: string[],
	chamber?: BinaryChamber,
	house_no?: number
): Promise<Gender | undefined> {
	if (!firstName) {
		throw new Error('Name not provided');
	}

	if (!boyNames || !girlNames) {
		[girlNames, boyNames] = await Promise.all([
			fetchNames('girl'),
			fetchNames('boy'),
		]);
	}

	firstName = firstName.toLowerCase();

	if (
		boyNames.find((bn) => bn === firstName) &&
		girlNames.find((gn) => gn === firstName)
	)
		if (chamber! && house_no!)
			return handleUnisexName(firstName, chamber!, house_no);
		else return undefined;
	else if (
		boyNameExceptions.some((ex) => ex.toLowerCase() === firstName) ||
		boyNames.find((bn) => bn === firstName)
	)
		return 'male';
	else if (
		girlNameExceptions.some((ex) => ex.toLowerCase() === firstName) ||
		girlNames.find((gn) => gn === firstName)
	)
		return 'female';
	else return undefined;
}
