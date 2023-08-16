/** @format */

import { getEndDateObj } from '@/Functions/Util/dates';
import { BinaryChamber } from '@/Models/_utility';
import { DateRangeStr, OirDate } from '@/Models/dates';
import { RawOffice } from '.';
import { getEndDateStr } from '../../../../../../Util/dates';
import { MemberOffice, OfficeType } from '@/Models/DB/office';

export default function parseAndFormatOffices(
	offices: RawOffice[]
): MemberOffice[] {
	const parsed: MemberOffice[] = [];
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
	return parsed
		.filter(Boolean)
		.sort((a, b) => a.dateRange.start.getTime() - b.dateRange.start.getTime());
}

function parseOfficeType(office: string): OfficeType {
	if (office.toLowerCase().includes('of state')) return 'junior';
	else return 'senior';
}
