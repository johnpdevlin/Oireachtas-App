/** @format */

import { RawMember } from '@/models/oireachtas_api/member';
import { filterMemberCommitteeRecordsByHouse } from './filter_by_house';
import parseMemberships from '@/functions/APIs/Oireachtas/member/formatted/parse_memberships/_index';
import { BinaryChamber } from '@/models/_utils';
import { groupObjectsByProperty } from '@/functions/_utils/objects';
import { aggregateMemberAttendance } from './aggregate_attendance';
import { handleMembershipExceptions } from './membership_exceptions';
import { AttendanceRecord, GroupAttendanceRecord } from '@/models/attendance';

export type MembershipType = 'constituency' | 'party';

async function aggregateMembershipAttendanceRecords(
	records: AttendanceRecord[],
	allMembers: RawMember[]
): Promise<GroupAttendanceRecord[]> {
	const { dail, seanad } = filterMemberCommitteeRecordsByHouse(
		records,
		allMembers
	);

	// Process records asynchronously and in parallel for efficiency
	const [dailRecords, seanadRecords, partyRecords] = await Promise.all([
		processConstituencies('dail', dail, allMembers),
		processConstituencies('seanad', seanad, allMembers),
		processParties([...dail, ...seanad], allMembers),
	]);

	// Group and aggregate records
	const aggregated = [...dailRecords, ...seanadRecords, ...partyRecords];
	const grouped = groupObjectsByProperty(aggregated, 'uri');

	const processed = grouped.map((group) =>
		aggregateMemberAttendance(
			group[0].group_type,
			group[0].uri,
			group.map((g) => g.record),
			allMembers
		)
	);

	return processed.flat();
}

function processParties(records: AttendanceRecord[], members: RawMember[]) {
	const processedMembers: {
		uri: string;
		group_type: MembershipType;
		record: AttendanceRecord;
	}[] = [];
	records.forEach((record) => {
		const matched = members.find((member) => record.uri === member.memberCode);
		if (!matched) console.info('no member found for ', record.uri);
		if (matched) {
			const parties = matched.memberships.flatMap((membership) =>
				membership.membership.parties.map((p) => {
					return { ...p.party, uri: p.party.partyCode };
				})
			);

			if (!parties || parties?.length === 0)
				console.info('No parties found for: ', matched.memberCode);
			else if (!parties.some((p) => p.uri !== parties[0].uri))
				// If there are no other parties recorded (identified by uri)
				processedMembers.push({
					uri: parties![0].uri,
					group_type: 'party',
					record: record,
				});
			else {
				const exceptions = handleMembershipExceptions(
					parties!,
					'party',
					record
				);

				processedMembers.push(...exceptions.flat()!);
			}
		}
	});
	return processedMembers;
}

function processConstituencies(
	chamber: BinaryChamber,
	records: AttendanceRecord[],
	members: RawMember[]
) {
	const processedMembers: {
		uri: string;
		group_type: MembershipType;
		record: AttendanceRecord;
	}[] = [];
	records.forEach((record) => {
		const matched = members.find((member) => record.uri === member.memberCode);
		if (!matched) console.info('no member found for ', record.uri);
		if (matched) {
			const constits = parseMemberships(matched.memberships).constituencies;
			if (!constits[chamber] || constits[chamber]?.length === 0)
				console.info('no constituencies found for ', matched.memberCode);
			else if (constits[chamber]?.length === 1)
				processedMembers.push({
					uri: constits[chamber]![0].uri,
					group_type: 'constituency',
					record: record,
				});
			else if (constits[chamber]!.length > 1) {
				const exceptions = handleMembershipExceptions(
					constits[chamber]!,
					'constituency',
					record
				);
				processedMembers.push(...exceptions!);
			}
		}
	});
	return processedMembers;
}

export { aggregateMembershipAttendanceRecords };
