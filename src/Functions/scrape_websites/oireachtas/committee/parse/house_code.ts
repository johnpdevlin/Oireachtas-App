/** @format */
import { RawOuterMembership } from '@/models/oireachtasApi/member';
import { BinaryChamber } from '@/models/_utils';

// Parses memberships to find relevant housecode
export function getHouseCode(
	memberships: RawOuterMembership[],
	date_start?: Date,
	date_end?: Date,
	excpDate?: Date
): BinaryChamber | undefined {
	let relevantMembership:
		| { houseCode: BinaryChamber; endDate: number | null }
		| undefined;

	const ms = memberships.map((mem: RawOuterMembership) => {
		return mem.membership;
	});
	ms?.forEach((membership) => {
		if (ms.length === 1) {
			relevantMembership = {
				houseCode: membership.house.houseCode,
				endDate: null,
			};
		} else {
			const endDate = membership.dateRange.end!
				? new Date(membership.dateRange.end).getTime()
				: null;

			if (relevantMembership?.endDate !== null) {
				if (
					date_start &&
					date_end &&
					endDate! &&
					date_start?.getTime() >=
						new Date(membership.dateRange.start).getTime() &&
					date_end?.getTime() <= endDate
				) {
					// Deals with past members
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (!excpDate && endDate === null) {
					// If no excpetions and endDate is 0 (undefined)
					relevantMembership = {
						houseCode: membership.house.houseCode,
						endDate: endDate,
					};
				} else if (
					!relevantMembership ||
					endDate! > relevantMembership.endDate!
				) {
					if (!excpDate || excpDate.getTime() > endDate!) {
						relevantMembership = {
							houseCode: membership.house.houseCode,
							endDate: endDate,
						};
					}
				}
			}
		}
	});

	return relevantMembership?.houseCode;
}
