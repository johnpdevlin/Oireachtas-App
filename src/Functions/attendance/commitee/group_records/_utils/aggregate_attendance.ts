/** @format */

import { getHouseCode } from '@/functions/oireachtas_pages/committee/parse/house_code';
import { BinaryChamber, GroupType, MemberBaseKeys } from '@/models/_utils';
import {
	CommitteeAttendanceRecord,
	GroupCommitteeAttendanceRecord,
} from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';

function aggregateMemberAttendance(
	group_type: GroupType,
	uri: string,
	records: CommitteeAttendanceRecord[],
	members: RawMember[]
): GroupCommitteeAttendanceRecord[] {
	const aggregatedRecordsMap: Map<string, GroupCommitteeAttendanceRecord> =
		new Map();

	let memberHouseCodes: { uri: string; house_code: BinaryChamber }[] = [];

	records.forEach((record) => {
		const recordKey = `${group_type}-${uri}-${record.year}`;
		let aggregated = aggregatedRecordsMap.get(recordKey);

		if (!aggregated) {
			// if doesn't exist create new object
			aggregated = initializeAttendanceSummary(uri, record.year!, group_type);
			aggregatedRecordsMap.set(recordKey, aggregated);
		}

		// Aggregate monthly data for present, absent, and also_present.
		const statuses: (keyof CommitteeAttendanceRecord)[] = [
			'present',
			'absent',
			'also_present',
		];

		statuses.forEach((status: string) => {
			if (
				status === 'present' ||
				status === 'absent' ||
				status === 'also_present'
			) {
				for (let month = 0; month < 12; month++) {
					if (record[status][month]) {
						let house_code: BinaryChamber;
						if (group_type === 'dail' || group_type === 'seanad')
							house_code = group_type;
						else {
							const hc = getMemberHouseCode(
								record.uri,
								memberHouseCodes,
								members
							);
							house_code = hc.house_code;
							memberHouseCodes = hc.memberHouseCodes;
						}

						const memberRec = record[status][month].map((m) => {
							return { uri: record.uri, date: m, house_code: house_code };
						});
						aggregated![status][month].push(...memberRec);
					}
				}
			}
		});
	});

	// Convert the map back to an array
	return Array.from(aggregatedRecordsMap.values());
}

function initializeAttendanceSummary(
	uri: string,
	year: number,
	group_type: GroupType
): GroupCommitteeAttendanceRecord {
	return {
		uri: `${
			group_type === ('dail' || 'seanad') ? `${group_type}-${uri}` : uri
		}`,
		record_uri: `${group_type}-${uri}-${year}`,
		year: year,
		group_type: group_type,
		present: Array.from({ length: 12 }, () => []),
		absent: Array.from({ length: 12 }, () => []),
		also_present: Array.from({ length: 12 }, () => []),
	};
}

function getMemberHouseCode(
	uri: string,
	memberHouseCodes: { uri: string; house_code: BinaryChamber }[],
	members: RawMember[]
): {
	house_code: BinaryChamber;
	memberHouseCodes: { uri: string; house_code: BinaryChamber }[];
} {
	if (memberHouseCodes.length === 0) {
		memberHouseCodes = members.map((member) => {
			return {
				uri: member.memberCode,
				house_code: getHouseCode(member.memberships)!,
			};
		});
	}
	return {
		house_code: memberHouseCodes.find((member) => member.uri === uri)!
			.house_code,
		memberHouseCodes: memberHouseCodes,
	};
}

export { aggregateMemberAttendance };
