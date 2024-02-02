/** @format */
import { getEndDateStr } from '@/functions/_utils/dates';
import { groupObjectsByProperty } from '@/functions/_utils/objects';
import { RawMemberConstituency } from '.';
import { OirDate } from '@/models/dates';
import { MemberConstituency } from '@/models/oireachtasApi/Formatted/Member/constituency';
import { BinaryChamber } from '@/models/_utils';

/*  
	Destructures by house (dail & seanad) and then by constit
    Destructures into periods, merges unbroken periods 
    Returns structured objects by most recent 
*/
export default function parseConstituencies(constits: {
	dail: RawMemberConstituency[];
	seanad: RawMemberConstituency[];
}): {
	dail?: MemberConstituency[];
	seanad?: MemberConstituency[];
	isActiveTD: boolean;
	isActiveSenator: boolean;
} {
	const dail: MemberConstituency[] = [];
	const seanad: MemberConstituency[] = [];

	if (constits.dail! && constits.dail.length > 0) {
		const constitsByCode = groupObjectsByProperty(
			constits.dail,
			'representCode'
		);
		if (constitsByCode.length > 1) {
			// Deal with cases where membership was broken up
			constitsByCode.forEach((con) => {
				dail.push(...parseIndividualConstituency(con, 'dail'));
			});
		} else {
			dail.push(...parseIndividualConstituency(constits.dail, 'dail'));
		}
	}
	if (constits.seanad! && constits.seanad.length > 0) {
		const constitsByCode = groupObjectsByProperty(
			constits.seanad,
			'representCode'
		);
		if (constitsByCode.length > 1) {
			// Deal with cases where membership was broken up
			constitsByCode.forEach((con) => {
				seanad.push(...parseIndividualConstituency(con, 'seanad'));
			});
		} else {
			seanad.push(...parseIndividualConstituency(constits.seanad, 'seanad'));
		}
	}

	// Sort so most recent periods are first
	dail.sort(
		(a, b) =>
			new Date(b.dateRange.start).getTime() -
			new Date(a.dateRange.start).getTime()
	);
	seanad.sort(
		(a, b) =>
			new Date(b.dateRange.start).getTime() -
			new Date(a.dateRange.start).getTime()
	);

	const isActiveTD = !dail[0] || dail[0].dateRange.end! ? false : true;
	const isActiveSenator = !seanad[0] || seanad[0].dateRange.end! ? false : true;

	return { dail, seanad, isActiveTD, isActiveSenator };
}

/* 
	Parses to return merged continuous constits
	Uses HouseNo. to order and find gaps
*/
function parseIndividualConstituency(
	constits: RawMemberConstituency[],
	type: BinaryChamber
): MemberConstituency[] {
	constits.sort(
		(a, b) => parseInt(a.house.houseNo) - parseInt(b.house.houseNo)
	);

	const results: MemberConstituency[] = [];
	let start: OirDate | '' = '';
	let end: OirDate | undefined | null = null;
	let houseNo = 0;
	let houses: number[] = [];

	constits.forEach((con) => {
		const tempHouseNo = parseInt(con.house.houseNo);
		if (start === '') {
			// If first iteration of loop, assign values
			start = con.house.dateRange.start;
			end = getEndDateStr(con.house.dateRange.end);
			houseNo = tempHouseNo;
			houses.push(houseNo);
		} else if (tempHouseNo - houseNo !== 1) {
			// If not +1 (i.e. not 30 -> 31), thus new period
			results.push({
				name: con.showAs,
				chamber: type,
				uri: con.representCode,
				dateRange: { start: start, end: end },
				houses: houses,
			});
			start = con.house.dateRange.start as OirDate;
			end = getEndDateStr(con.house.dateRange.end);
			houseNo = tempHouseNo;
			houses = [tempHouseNo];
		} else {
			houses.push(tempHouseNo);
			houseNo = tempHouseNo;
			end = getEndDateStr(con.house.dateRange.end);
		}
	});

	// Loop finished so last object can be pushed
	results.push({
		name: constits.at(-1)!.showAs,
		chamber: type,
		uri: constits.at(-1)!.representCode,
		dateRange: { start: start as OirDate, end },
		houses: houses,
	});

	return results;
}
