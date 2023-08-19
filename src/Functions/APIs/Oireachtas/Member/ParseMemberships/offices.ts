/** @format */

import { getEndDateObj, getEndDateStr } from '@/Functions/_util/dates';
import { BinaryChamber } from '@/Models/_util';
import { DateRangeStr, OirDate } from '@/Models/dates';
import { RawMoffice } from '.';

import {
	MemberOffice,
	OfficeType,
} from '@/Models/OireachtasAPI/Formatted/Member/office';

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
				start: new Date(off.dateRange.start),
				end: getEndDateObj(off.dateRange.end as OirDate | undefined | null),
			},
			dateRangeStr: {
				start: off.dateRange.start,
				end: getEndDateStr(off.dateRange.end as OirDate | undefined | null),
			} as DateRangeStr,
		};
		parsed.push(office);
	});

	parsed = parsed
		.filter(Boolean)
		.sort((a, b) => b.dateRange.start.getTime() - a.dateRange.start.getTime());

	const isActiveSeniorMinister =
		parsed[0] &&
		parsed[0].dateRangeStr.end === undefined &&
		parsed[0].type === 'senior'
			? true
			: false;
	const isActiveJunior =
		!isActiveSeniorMinister &&
		parsed[0] &&
		parsed[0].dateRangeStr.end === undefined
			? true
			: false;

	return { offices: parsed, isActiveSeniorMinister, isActiveJunior };
}

function parseOfficeType(office: string): OfficeType {
	if (office.toLowerCase().includes('of state')) return 'junior';
	else return 'senior';
}