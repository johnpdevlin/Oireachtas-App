/** @format */

import { DateRangeStr } from '@/models/dates';
import { MemberCommittee } from '@/models/oireachtas_api/Formatted/Member/committee';
import { CommitteeName } from '@/models/oireachtas_api/committee';
import { RawMemberCommittee } from '@/models/oireachtas_api/committee';

function parseAndFormatCommittees(committees: RawMemberCommittee[]): {
	current: MemberCommittee[];
	past: MemberCommittee[];
} {
	const parsed = committees.map((committee) =>
		parseAndFormatCommittee(committee)
	);

	const current = extractCurrent(parsed);
	const past = extractPast(parsed);
	return { current, past };
}

function parseAndFormatCommittee(
	committee: RawMemberCommittee
): MemberCommittee {
	if (!committee.committeeName || committee.committeeName.length == 0)
		console.info(committee);

	const { name, nameGa, formerNames } = extractNames(committee.committeeName);
	return {
		uri: committee.uri,
		name,
		nameGa,
		formerNames,
		expiryType: committee.expiryType,
		houseNo: committee.houseNo,
		houseCode: committee.houseCode,
		committeeCode: committee.committeeCode,
		committeeType: committee.committeeType,
		committeeID: committee.committeeID,
		status: committee.mainStatus,
		dateRange: committee.memberDateRange,
		role: committee.role,
		serviceUnit: committee.serviceUnit,
	};
}

function extractNames(names: CommitteeName[]) {
	const currentName = extractCurrent(names);
	const formerNames =
		names.filter(
			(name) =>
				currentName[0].nameEn !== name.nameEn ||
				currentName[0].nameGa !== name.nameGa
		) ?? [];
	const name = currentName[0].nameEn;
	const nameGa = currentName[0].nameGa ?? undefined;
	return { name, nameGa, formerNames };
}

function extractCurrent<T extends { dateRange: DateRangeStr }>(
	array: T[]
): T[] {
	const current = array.filter((c) => !c.dateRange.end);
	return current;
}

function extractPast<T extends { dateRange: DateRangeStr }>(array: T[]): T[] {
	const past = array.filter((c) => c.dateRange.end!);
	return past;
}

export { parseAndFormatCommittees };
