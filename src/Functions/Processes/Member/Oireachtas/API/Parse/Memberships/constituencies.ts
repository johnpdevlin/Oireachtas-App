/** @format */

import { groupObjectsByProperty } from '@/Functions/Util/objects';
import { RawConstituency } from '.';
import { OirDate } from '@/Models/dates';
import { Constituency } from '@/Models/DB/constituency';
import { BinaryChamber, RepresentType } from '@/Models/_utility';
import { getEndDateObj, getEndDateStr } from '@/Functions/Util/dates';

/*  Destructures by house (dail & seanad) and then by constit
    Destructures into periods, merges unbroken periods 
    Returns structured objects */
export default function parseConstituencies(
	constits: RawConstituency[]
): Constituency[] {
	const formatted: Constituency[] = [];

	// Deal with cases where member was td and senator
	const constitsByHouses = groupObjectsByProperty(constits, 'representType');
	constitsByHouses.forEach((constit) => {
		// Deal With cases where member represented different constits
		const constitsByCode = groupObjectsByProperty(constit, 'representCode');
		constitsByCode.forEach((con) => {
			// Deal with cases where membership was broken up
			const parsed = parseIndividualConstituency(con);
			formatted.push(...parsed);
		});
	});

	return formatted.filter(Boolean);
}

function parseIndividualConstituency(
	constits: RawConstituency[]
): Constituency[] {
	constits.sort(
		(a, b) => parseInt(a.house.houseNo) - parseInt(b.house.houseNo)
	);
	const results: Constituency[] = [];
	let start: OirDate | '' = '';
	let end: OirDate | undefined | null | '';
	let houseNo = 0;
	let houses: number[] = [];

	constits.forEach((con) => {
		const tempHouseNo = parseInt(con.house.houseNo);
		if (start === '') {
			start = con.house.dateRange.start as OirDate;
			end = getEndDateStr(
				con.house.dateRange.end as OirDate | undefined | null
			);
			houseNo = tempHouseNo;
			houses.push(houseNo);
		} else if (tempHouseNo - houseNo !== 1) {
			// If not +1 (i.e. not 30 -> 31)

			results.push({
				name: con.showAs,
				chamber: getChamber(constits.at(-1)!.representType as RepresentType)!,
				uri: con.representCode,
				dateRangeStr: { start: start, end: end },
				dateRange: { start: new Date(start), end: end! },
				houses: houses,
			});
			start = con.house.dateRange.start as OirDate;
			end = getEndDateStr(
				con.house.dateRange.end as OirDate | undefined | null
			);
			houseNo = tempHouseNo;
			houses = [tempHouseNo];
		} else {
			houses.push(tempHouseNo);
			houseNo = tempHouseNo;
			end = getEndDateStr(
				con.house.dateRange.end as OirDate | undefined | null
			);
		}
	});
	results.push({
		name: constits.at(-1)!.showAs,
		chamber: getChamber(constits.at(-1)!.representType as RepresentType)!,
		uri: constits.at(-1)!.representCode,
		dateRangeStr: { start: start, end: end },
		dateRange: {
			start: new Date(start as OirDate),
			end: getEndDateObj(end),
		},
		houses: houses,
	});
	return results;
}

const getChamber = (representType: RepresentType): BinaryChamber | void => {
	if (representType === 'constituency') return 'dail';
	else if (representType === 'panel') return 'seanad';
};
