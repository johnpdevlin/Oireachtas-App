/** @format */

import { groupObjectsByProperty } from '@/functions/_utils/objects';
import { CommitteeAttendance } from '@/models/attendance';
import {
	RawCommittee,
	RawCommitteeMember,
} from '@/models/oireachtasApi/committee';

// Does additional verifications to offset incorrect/incomplete data from external API
async function verifyAttendanceReports(
	records: CommitteeAttendance[],
	committees: RawCommittee[]
): Promise<CommitteeAttendance[]> {
	try {
		const groupedRecords = groupObjectsByProperty(records, 'uri');
		const processedRecords: CommitteeAttendance[] = [];

		for (const recordGroup of groupedRecords) {
			const committeeURI = recordGroup[0].uri;
			const committee = committees.find((com) => com.uri === committeeURI);
			if (!committee) {
				console.warn(`No committee found for URI: ${committeeURI}`);
				continue;
			}

			const memberAndEarliest: { [key: string]: Date } = {};
			const processed = recordGroup.map((rec) => {
				rec.present.forEach((member) => {
					if (memberAndEarliest[member.uri] < rec.date)
						memberAndEarliest[member.uri] = rec.date;
				});

				const additionalAbsent = findAdditionalAbsentMembers(
					rec,
					committee.members
				);
				additionalAbsent.forEach((aa) => {
					if (memberAndEarliest[aa.uri] <= rec.date) {
						rec.absent.push({ name: aa.fullName, uri: aa.uri });
					}
				});

				rec.also_present.forEach((as) => {
					if (memberAndEarliest[as.uri] <= rec.date) {
						rec.present.push(as);
						rec.also_present = rec.also_present.filter(
							(also) => also.uri !== as.uri
						);
					}
				});

				return rec;
			});

			processedRecords.push(...processed);
		}

		return processedRecords;
	} catch (error) {
		console.error('Error in verifyAttendanceReports:', error);
		return [];
	}
}

function findAdditionalAbsentMembers(
	record: CommitteeAttendance,
	committeeMembers: RawCommitteeMember[]
): RawCommitteeMember[] {
	return committeeMembers.filter(
		(member) =>
			!record.absent.some((absent) => absent.uri === member.uri) &&
			!record.present.some((present) => present.uri === member.uri) &&
			!record.also_present.some((alsoPresent) => alsoPresent.uri === member.uri)
	);
}

export { verifyAttendanceReports };
