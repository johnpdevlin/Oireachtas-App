/** @format */

import fetchNames from '@/functions/APIs_/Irish_Names_/fetch_names_';

export default async function checkGender(
	firstName: string,
	boyNames?: Record<number, string>,
	girlNames?: Record<number, string>
): Promise<string | void> {
	if (firstName == (undefined || null))
		return console.log(`${firstName} name not passed into function`);

	// gets all names registered by gender if not supplied
	if (!boyNames && !girlNames) {
		girlNames = (await fetchNames('girl')) as Record<number, string>;
		boyNames = (await fetchNames('boy')) as Record<number, string>;
	}

	if (boyNames! && girlNames!) {
		firstName = firstName.toLowerCase();

		if (
			// check if male and female name
			Object.values(girlNames).includes(firstName) &&
			Object.values(boyNames).includes(firstName)
		) {
			console.log(`${firstName} is considered both a male and female name.`);
		} else if (
			// Check if male
			Object.values(boyNames).includes(firstName)!
		) {
			return 'male';
		} else if (
			// check if female
			Object.values(girlNames).includes(firstName)!
		) {
			return 'female';
		} else {
			console.log(
				`${firstName} appears to have never been registered in Ireland.`
			);
		}
		console.log(`${firstName}`);
	} else console.log('No names provided and none can be fetched.');
}
