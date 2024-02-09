/** @format */

import { Chamber } from '@/models/_utils';
import { Committee, CommitteeAttendance } from '@/models/committee';
import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import similarity from 'string-similarity';
import parseCommitteeReport from './parse_committee_attendance';

// Binds committee reports to debate records.
export async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[],
	committees: Committee[],
	members: RawMember[]
): Promise<CommitteeAttendance[]> {
	const parsedRecords: CommitteeAttendance[] = [];
	const totalRecords: number = records.length;

	console.log(`Binding ${totalRecords} reports to records...`);

	for (let count = 0; count < totalRecords; count++) {
		const record = records[count];

		if (!record.pdf) {
			console.error('Issue with the following record: ', record);
			continue; // Skip this record and continue with the next one
		}

		const committee = findMatchingCommittee(record.rootURI, committees);
		if (!committee) {
			console.log(
				'No committee found rootURI: ',
				record.rootURI,
				' url: ',
				record.uri
			);
			continue; // Skip this record and continue with the next one
		}

		const report = await parseCommitteeReport(
			record.pdf,
			committee,
			members,
			record.date
		);
		if (!report) {
			console.error('Error parsing committee report: ', record);
			continue; // Skip this record and continue with the next one
		}

		const parsedRecord = {
			date: record.date,
			dateStr: record.dateStr,
			rootName: record.rootName,
			name: record.name,
			rootURI: record.rootURI,
			uri: record.uri!,
			committeeType: report.type,
			type: record.type!,
			houseNo: record.houseNo,
			chamber: record.chamber as Exclude<Chamber, 'dail & seanad'>,
			pdf: record.pdf,
			xml: record.xml!,
			present: report.present,
			...(report.absent && { absent: report.absent }),
			...(report.alsoPresent && { alsoPresent: report.alsoPresent }),
		};

		parsedRecords.push(parsedRecord);

		if (count % 100 === 0 && count !== 0) {
			console.info(`${count} bound...`);
		}
	}

	console.log(
		`${parsedRecords.length} reports successfully bound to records. Process completed.`
	);

	return parsedRecords;
}

/**
 * Helper function to find a matching committee.
 *
 * @param {string} rootURI - Root URI to match.
 * @param {Committee[]} committees - List of committees to search.
 * @returns {Committee | null} Matched committee or null if not found.
 */
function findMatchingCommittee(
	rootURI: string,
	committees: Committee[]
): Committee | undefined {
	const committee = committees.find((c) => c.uri === rootURI);
	if (committee) {
		return committee;
	}

	const match = similarity.findBestMatch(
		rootURI,
		committees.map((c) => c.uri)
	).bestMatch.target;

	return committees.find((c) => c.uri === match);
}
