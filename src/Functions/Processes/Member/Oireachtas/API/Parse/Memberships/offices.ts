/** @format */

import { RawMemberOffice, RawMembership } from '@/Models/OireachtasAPI/member';
import { BinaryChamber, ChamberType } from '@/Models/_utility';

type RawOffice = {
	name: string;
	type: string;
	dateRange: { start: string; end: string | null | undefined };
	house: {
		dateRange: { start: string; end: string | null };
		houseCode: BinaryChamber;
		uri: string;
		houseNo: string;
		showAs: string;
		chamberType: ChamberType;
	};
};
export function parseOffices(membership: RawMembership): RawOffice[] {
	const offices: RawOffice[] = [];
	const house = { ...membership.house, dateRange: membership.dateRange };
	membership.offices.map((off: { office: RawMemberOffice }) => {
		const office = off.office;
		offices.push({
			name: office.officeName.showAs,
			type: parseOfficeType(office.officeName.showAs),
			dateRange: office.dateRange,
			house,
		});
	});
	return offices;
}

function parseOfficeType(office: string): string {
	if (office.toLowerCase().includes('of state')) return 'junior';
	else return 'senior';
}
