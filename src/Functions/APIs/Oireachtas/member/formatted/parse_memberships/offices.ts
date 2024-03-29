/** @format */
import { getEndDateStr } from '@/functions/_utils/dates';
import { BinaryChamber } from '@/models/_utils';
import { DateRangeStr } from '@/models/dates';
import { RawMoffice } from './_index';

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
				end: getEndDateStr(off.dateRange.end!),
			} as DateRangeStr,
		};
		parsed.push(office);
	});

	// Sort so current and most recent offices are at start of array
	parsed = parsed.filter(Boolean).sort((a, b) => {
		// Check for undefined or null dateRange.end values
		if (!a.dateRange.end && !b.dateRange.end) {
			return 0; // Both are undefined or null, so they are considered equal
		}
		if (!a.dateRange.end) {
			return -1; // a comes first as it has an undefined or null end date
		}
		if (!b.dateRange.end) {
			return 1; // b comes first as it has an undefined or null end date
		}

		// Compare dateRange.start for all other cases
		return (
			new Date(b.dateRange.start).getTime() -
			new Date(a.dateRange.start).getTime()
		);
	});

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
