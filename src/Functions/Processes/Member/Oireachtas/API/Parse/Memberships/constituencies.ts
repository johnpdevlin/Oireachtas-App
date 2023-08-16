/** @format */
import { getEndDateObj, getEndDateStr } from '@/Functions/Util/dates';
import { groupObjectsByProperty } from '@/Functions/Util/objects';
import { RawConstituency } from '.';
import { OirDate } from '@/Models/dates';
import { MemberConstituency } from '@/Models/DB/constituency';
import { BinaryChamber, RepresentType } from '@/Models/_utility';

/*  Destructures by house (dail & seanad) and then by constit
    Destructures into periods, merges unbroken periods 
    Returns structured objects by most recent */
export default function parseConstituencies(constits: RawConstituency[]): {
	dail: MemberConstituency[];
	seanad?: MemberConstituency[];
} {
	const dail: MemberConstituency[] = [];
	const seanad: MemberConstituency[] = [];
	// Deal with cases where member was td and senator
	const constitsByHouses: [RawConstituency[], RawConstituency[]?] =
		groupObjectsByProperty(constits, 'representType') as [
			RawConstituency[],
			RawConstituency[]?
		];
	constitsByHouses.forEach((constit, index) => {
		// Deal With cases where member represented different constits
		const constitsByCode = groupObjectsByProperty(constit!, 'representCode');
		constitsByCode.forEach((con) => {
			// Deal with cases where membership was broken up
			const parsed = parseIndividualConstituency(con);
			if (index === 0) dail.push(...parsed);
			else seanad.push(...parsed);
		});
	});

	return { dail: dail, seanad: seanad };
}

// Parses to return merged continuous constits
function parseIndividualConstituency(
	constits: RawConstituency[]
): MemberConstituency[] {
	constits.sort(
		(a, b) => parseInt(a.house.houseNo) - parseInt(b.house.houseNo)
	);
	const results: MemberConstituency[] = [];
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
			end: getEndDateObj(end as OirDate | undefined | null),
		},
		houses: houses,
	});
	return results.reverse();
}

// Parse the representType to get the chamber
function getChamber(representType: RepresentType): BinaryChamber {
	if (representType === 'constituency') return 'dail';
	else return 'seanad';
}
