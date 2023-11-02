/** @format */

import { getEndDateObj, getEndDateStr } from '@/functions/_utils/dates';
import { BinaryChamber } from '@/models/_utils';
import { DateRangeStr, OirDate } from '@/models/dates';
import { RawMoffice } from '.';

import {
	MemberOffice,
	OfficeType,
} from '@/models/oireachtasApi/Formatted/Member/office';

export default function parseAndFormatOffices(offices: RawMoffice[]): {
	offices: MemberOffice[];
	isActiveSeniorMinister: boolean;
	isActiveJunior: boolean;
} {
	let parsed: MemberOffice[] = [];
	offices.forEach((off) => {
		const office = {
			name: off.officeName.showAs,
			type: parseOfficeType(off.officeName.showAs),
			chamber: off.house.houseCode as BinaryChamber,
			houseNo: parseInt(off.house.houseNo),
			chamberStr: off.house.showAs,
			dateRange: {
				start: off.dateRange.start,
				end: getEndDateStr(off.dateRange.end as OirDate | undefined | null),
			} as DateRangeStr,
		};
		parsed.push(office);
	});

	parsed = parsed
		.filter(Boolean)
		.sort(
			(a, b) =>
				new Date(b.dateRange.start).getTime() -
				new Date(a.dateRange.start).getTime()
		);

	const isActiveSeniorMinister =
		parsed[0] &&
		(parsed[0].dateRange.end === undefined ||
			parsed[0].dateRange.end === null) &&
		parsed[0].type === 'senior'
			? true
			: false;
	const isActiveJunior =
		!isActiveSeniorMinister &&
		parsed[0] &&
		(parsed[0].dateRange.end === undefined || parsed[0].dateRange.end === null)
			? true
			: false;

	return { offices: parsed, isActiveSeniorMinister, isActiveJunior };
}

function parseOfficeType(office: string): OfficeType {
	if (office.toLowerCase().includes('of state')) return 'junior';
	else return 'senior';
}
