/** @format */

import { DateRangeStr } from '@/models/dates';
import { MemberCommittee } from '@/models/oireachtasApi/Formatted/Member/committee';
import { CommitteeName } from '@/models/oireachtasApi/committee';
import { RawMemberCommittee } from '@/models/oireachtasApi/member';

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
	const uri = committee.committeeURI!;
	const { name, nameGa, formerNames } = extractNames(committee.committeeName);
	return {
		uri,
		name,
		nameGa,
		formerNames,
		expiryType: committee.expiryType,
		houseNo: committee.houseNo,
		altCommitteeURIs: committee.altCommitteeURIs,
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
	const formerNames = names.filter(
		(name) =>
			currentName[0].nameEn !== name.nameEn ||
			currentName[0].nameGa !== name.nameGa
	);
	const name = currentName[0].nameEn;
	const nameGa = currentName[0].nameGa;
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
