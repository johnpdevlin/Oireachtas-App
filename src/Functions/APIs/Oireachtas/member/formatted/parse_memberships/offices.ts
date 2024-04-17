/** @format */
import { BinaryChamber } from '@/models/_utils';
import { RawMoffice } from './_index';
import {
	MemberOffice,
	OfficeType,
} from '@/models/oireachtas_api/Formatted/Member/office';
import { groupObjectsByProperty } from '../../../../../_utils/objects';

type ParsedOffices = {
	offices: MemberOffice[];
	isActiveSeniorMinister: boolean;
	isActiveJuniorMinister: boolean;
};

export default function parseAndFormatOffices(
	offices: RawMoffice[]
): ParsedOffices {
	const processedOffices: MemberOffice[] = [];

	const formattedOffices = offices.map((off) => {
		return {
			name: off.officeName.showAs,
			type: parseOfficeType(off.officeName.showAs),
			chamber: off.house.houseCode as BinaryChamber,
			houseNos: [parseInt(off.house.houseNo)],
			chamberStr: off.house.showAs,
			dateRange: off.dateRange,
		};
	}) as MemberOffice[];
	const groupedOffices = groupObjectsByProperty(formattedOffices, 'name');

	for (const offs of groupedOffices) {
		const sorted = offs.toSorted(
			(a, b) =>
				new Date(a.dateRange.start).getTime() -
				new Date(b.dateRange.start).getTime()
		);

		let currentOffice: MemberOffice | null = null;
		// console.info(sorted);
		sorted.forEach((off) => {
			if (!currentOffice) {
				currentOffice = off;
			} else if (checkIsContinuous(currentOffice, off) === true) {
				currentOffice.dateRange.end = off.dateRange.end ?? undefined;
				currentOffice.houseNos.push(...off.houseNos);
			} else {
				processedOffices.push({ ...currentOffice }); // Push a new copy of currentParty
				currentOffice = off;
			}
		});

		if (currentOffice) {
			processedOffices.push(currentOffice); // Push the last currentParty
		}
	}

	const isActiveSeniorMinister =
		processedOffices[0] &&
		processedOffices[0].type === 'senior' &&
		!processedOffices[0].dateRange.end
			? true
			: false;

	const isActiveJuniorMinister =
		!isActiveSeniorMinister &&
		processedOffices[0] &&
		!processedOffices[0].dateRange.end
			? true
			: false;

	return {
		offices: processedOffices ?? [],
		isActiveSeniorMinister,
		isActiveJuniorMinister,
	};
}

function checkIsContinuous(
	currentOffice: MemberOffice,
	newOffice: MemberOffice
): boolean {
	const start = new Date(newOffice.dateRange.start);
	const end = new Date(currentOffice.dateRange.end!);
	const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

	// Check if the start date of the new office is within 30 days of the end date of the current office
	return (
		currentOffice.name === newOffice.name &&
		start.getTime() - end.getTime() <= thirtyDaysInMillis
	);
}
function parseOfficeType(office: string): OfficeType {
	if (office.toLowerCase().includes('of state')) return 'junior';
	else return 'senior';
}
