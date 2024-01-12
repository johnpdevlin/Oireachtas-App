/** @format */

import fetchNames from './fetch_names_';

export default async function checkGender(
	firstName: string,
	boyNames?: Record<number, string>,
	girlNames?: Record<number, string>
): Promise<string> {
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
	const boysSet = new Set(Object.values(boyNames));
	const girlsSet = new Set(Object.values(girlNames));

	if (boysSet.has(firstName) && girlsSet.has(firstName)) {
		return 'unisex';
	} else if (boysSet.has(firstName)) {
		return 'male';
	} else if (girlsSet.has(firstName)) {
		return 'female';
	}

	return 'unknown';
}
