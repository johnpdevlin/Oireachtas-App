/** @format */

import fetchNames from './fetch_names_';

export default async function checkGender(
	firstName: string,
	boyNames?: string[],
	girlNames?: string[]
): Promise<'unisex' | 'female' | 'male' | 'unknown'> {
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
		return 'unisex';
	else if (boyNames.find((bn) => bn === firstName)) return 'male';
	else if (girlNames.find((gn) => gn === firstName)) return 'female';
	else return 'unknown';
}
