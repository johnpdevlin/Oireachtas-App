/** @format */

import fetchNames from '@/Functions/API-Calls/IrishNamesAPI';

export default async function checkGender(firstName: string) {
	// gets all names registered by gender
	const girlNames: string[] | undefined = await fetchNames('girl');
	const boyNames: string[] | undefined = await fetchNames('boy');

	if (firstName == (undefined || null)) return console.log('Name not found');

	if (
		// Check if male and not female name
		Object.values(boyNames!).includes(firstName) &&
		Object.values(girlNames!).includes(firstName) == false
	)
		return 'Male';

	if (
		// inverse of above
		Object.values(girlNames!).includes(firstName) &&
		Object.values(boyNames!).includes(firstName) == false
	)
		return 'Female';

	return console.log(
		'Name never been registered in Ireland or is considered both a male and female name.'
	);
}
