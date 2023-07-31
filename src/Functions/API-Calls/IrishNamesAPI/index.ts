/** @format */

import fetchNames from '@/Functions/API-Calls/IrishNamesAPI/fetchNames';

export default async function checkGender(
	firstName: string
): Promise<string | void> {
	// gets all names registered by gender
	const girlNames: string[] | undefined = await fetchNames('girl');
	const boyNames: string[] | undefined = await fetchNames('boy');

	if (firstName == (undefined || null)) return console.log('Name not found');

	if (
		// Check if male and not female name
		Object.values(boyNames!).includes(firstName)! &&
		!Object.values(girlNames!).includes(firstName)
	)
		return 'Male';
	else if (
		// inverse of above
		Object.values(girlNames!).includes(firstName)! &&
		!Object.values(boyNames!).includes(firstName)
	)
		return 'Female';
	else if (
		// inverse of above
		Object.values(girlNames!).includes(firstName)! &&
		Object.values(boyNames!).includes(firstName)!
	)
		return console.log('Name is considered both a male and female name.');
	return console.log(
		'Name never been registered in Ireland or is considered both a male and female name.'
	);
}
