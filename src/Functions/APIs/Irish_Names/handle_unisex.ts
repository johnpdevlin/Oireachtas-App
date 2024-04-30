/** @format */

import { Gender } from '@/models/member/_all_bio_data';
import { BinaryChamber } from '../../../models/_utils';
export function handleUnisexName(
	name: string,
	chamber: BinaryChamber,
	house_no: number
): Gender | undefined {
	const data = [
		{
			chamber: 'dail',
			house_no: 33,
			boyNames: ['Darragh', 'Dara', 'Frank', 'Charlie', 'Jackie'],
			girlNames: ['Marian'],
		},
	];

	const houseData = data.find(
		(d) => d.chamber === chamber && d.house_no === house_no
	);

	return houseData?.boyNames.some(
		(bn) => bn.toLowerCase() === name.toLowerCase()
	)
		? 'male'
		: houseData?.girlNames.some((gn) => gn.toLowerCase() === name.toLowerCase())
		? 'female'
		: undefined;
}
