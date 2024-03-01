/** @format */

import { Chamber } from '@/models/_utils';
import { RawMember } from '@/models/oireachtasApi/member';
import { CommitteeDebateRecord } from '@/models/oireachtasApi/debate';
import similarity from 'string-similarity';
import parseCommitteeReport from '../parse/_parse_committee_attendance';
import { CommitteeAttendance } from '@/models/attendance';
import { RawCommittee } from '@/models/oireachtasApi/committee';

// Binds committee reports to debate records.

// Binds committee reports to debate records.
export async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[],
	committees: RawCommittee[],
	allMembers: RawMember[]
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

		const possibleURIs = getPossibleURIsAndHouseNo(record.uri, committees);
		const committee = findMatchingCommitteeURI(
			record.uri,
			possibleURIs,
			committees
		);
		if (!committee) {
			console.log(
				'No committee found for: ',
				record.name,
				' uri: ',
				record.uri
			);
			continue; // Skip this record and continue with the next one
		}

		const report = await parseCommitteeReport(
			record.pdf,
			committee,
			allMembers,
			record.date
		);
		if (!report) {
			console.error('Error parsing committee report: ', record);
			continue; // Skip this record and continue with the next one
		}

		if (committee.uri === 'seanad_public_consultation_committee') {
		}
		const parsedRecord: CommitteeAttendance = {
			uri: record.uri!,
			committeeCode: record.committeeCode,
			date: record.date,
			dateStr: record.dateStr,
			rootName: record.rootName,
			name: record.name,
			rootURI: record.rootURI,
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

		if (committee.uri === 'seanad_public_consultation_committee') {
			console.info(report);
			console.info(parsedRecords);
		}
		if (count % 100 === 0 && count !== 0) {
			console.info(`${count} bound...`);
		}
	}

	console.log(
		`${parsedRecords.length} reports successfully bound to records. Process completed.`
	);

	return parsedRecords;
}

function getPossibleURIsAndHouseNo(uri: string, committees: RawCommittee[]) {
	const houseNo = uri.split('/').at(-2);
	const possibleURIs: string[] = [];
	committees.forEach((c) => {
		if (!houseNo || c.uri.includes(houseNo)) {
			possibleURIs.push(c.uri);
			if (c.altCommitteeURIs) possibleURIs.push(...c.altCommitteeURIs);
		}
	});
	return possibleURIs;
}

// Helper function to find a matching committee.
function findMatchingCommitteeURI(
	uri: string,
	possibleURIs: string[],
	committees: RawCommittee[]
): RawCommittee | undefined {
	const committee = committees.find(
		(c) => c.uri === uri || c.altCommitteeURIs?.includes(uri)
	);
	if (committee) return committee;

	const bestMatch = similarity.findBestMatch(uri, possibleURIs).bestMatch
		.target;

	if (bestMatch) {
		return committees.find(
			(c) => c.uri === bestMatch || c.altCommitteeURIs?.includes(bestMatch)
		);
	} else console.info('No match returned.');
}
