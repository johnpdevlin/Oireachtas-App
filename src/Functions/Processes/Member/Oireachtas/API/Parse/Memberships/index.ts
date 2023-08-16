/** @format */

import {
	RawMemberHouse,
	RawMemberParty,
	RawMemberRepresent,
	RawOuterMembership,
} from '@/Models/OireachtasAPI/member';
import parseAndFormatOffices from './offices';
import { RawMemberOffice } from '../../../../../../../Models/OireachtasAPI/member';
import parseAndFormatConstituencies from './constituencies';
import parseAndFormatParties from './parties';
import { BinaryChamber } from '@/Models/_utility';
import { getEndDateObj } from '@/Functions/Util/dates';
import { DateRangeStr, OirDate } from '@/Models/dates';

export default function parseMemberships(memberships: RawOuterMembership[]) {
	const destructured = destructureMemberships(memberships);

	const constituencies = parseAndFormatConstituencies(
		destructured.constituencies
	);
	const parties = parseAndFormatParties(destructured.parties);
	const offices = parseAndFormatOffices(destructured.offices as RawOffice[]);

	return {
		constituencies,
		parties,
		...(offices.length > 0 && { offices: offices }),
	};
}

type House = RawMemberHouse & { dateRange: DateRangeStr };

export type RawOffice = RawMemberOffice & { house: House };
export type RawConstituency = RawMemberRepresent & { house: House };
export type RawParty = RawMemberParty & {
	house: House;
	chamber: BinaryChamber;
	start: Date;
	end: Date | undefined;
};

type RawMembershipsObj = {
	offices?: RawOffice[];
	constituencies: RawConstituency[];
	parties: RawParty[];
};
// Destructures and formats so can be easily processed / compared
function destructureMemberships(
	memberships: RawOuterMembership[]
): RawMembershipsObj {
	let offices: RawOffice[] = [];
	let constituencies: RawConstituency[] = [];
	let parties: RawParty[] = [];

	memberships.map((membership) => {
		const mem = membership.membership;

		// House allows for easy comparison
		const house: House = {
			...mem.house,
			dateRange: mem.dateRange as DateRangeStr,
		};

		if (mem.offices?.length > 0)
			mem.offices.map((office) => offices.push({ house, ...office.office }));
		if (mem.represents?.length > 0)
			mem.represents.map((represent) =>
				constituencies.push({ house, ...represent.represent })
			);
		if (mem.parties?.length > 0)
			mem.parties.map((party) =>
				parties.push({
					house,
					chamber: house.houseCode,
					start: new Date(party.party.dateRange.start),
					end: getEndDateObj(
						party.party.dateRange.end as OirDate | undefined | null
					),
					...party.party,
				})
			);
	});
	return { offices, parties, constituencies };
}
