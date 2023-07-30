/** @format */

import { CommitteeDebateRecord } from '@/Models/OireachtasAPI/debate';
import { Chamber } from '@/Models/_utility';

import { Committee, CommitteeAttendance } from '@/Models/committee';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import parseCommitteeReport from './parseReport';
import similarity from 'string-similarity';

// Receives Debate Records
// Uses record ref to parse individual Committee Report
// Binds Debate Records to Committee Attendance Reports
export async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[],
	committees: Committee[],
	members: RawFormattedMember[]
): Promise<CommitteeAttendance[]> {
	const parsed: CommitteeAttendance[] = [];
	const total = records.length;
	console.log(`binding ${total} reports to records...`);

	const committeeURIs = committees.map((c) => c.uri);
	let count = 0;
	for (const record of records) {
		count++;
		if (record.pdf) {
			let committee = committees.find((c) => c.uri == record.rootURI);
			if (!committee) {
				const match = similarity.findBestMatch(record.rootURI, committeeURIs)
					.bestMatch.target;
				committee = committees.find((c) => c.uri === match);
				record.rootURI = match;

				if (!committee)
					console.log(
						'no committee found rootURI: ',
						record.rootURI,
						'url:',
						record.uri
					);
			}

			const report = await parseCommitteeReport(
				record.pdf,
				committee as Committee,
				members!,
				record.date
			);

			parsed.push({
				date: record.date,
				dateStr: record.dateStr,
				rootName: record.rootName,
				name: record.name,
				rootURI: record.rootURI,
				uri: record.uri!,
				type: record.type!,
				houseNo: record.houseNo,
				chamber: record.chamber as Exclude<Chamber, 'dail & seanad'>,
				pdf: record.pdf,
				xml: record.xml!,
				present: report.present,
				...(report.absent! && { absent: report.absent }),
				...(report.alsoPresent! && { alsoPresent: report.alsoPresent }),
			});
		} else {
			console.error('issue with following record: ' + record);
		}
		setTimeout(() => bindReportsToDebateRecords, 50); // To stop API returning errors
		if (count % 50 === 0) {
			console.log(`${count} bound...`);
			break;
		}
		if (count % 500 === 0) {
			break;
		}
	}
	console.log(
		`${count} reports successfully bound to records. Process completed.`
	);
	return parsed;
}

export function bindRecordToCommittee(
	record: CommitteeAttendance,
	committees: Committee[]
): string | undefined {
	const matchedCommittees = committees.filter(
		(c) =>
			record.rootName.includes(c.uri) ||
			record.rootURI.includes(c.uri) ||
			c.uri.includes(record.rootURI)
	);

	if (matchedCommittees.length === 1) {
		return matchedCommittees[0].uri;
	} else if (matchedCommittees.length === 0) {
		console.warn(`No committee matches for following record: \n${record}`);
		return undefined;
	} else if (matchedCommittees.length > 1) {
		// Handles expired and successor committee
		// Compares record against endDate
		const date = record.date.getTime();
		const isExpired = matchedCommittees.filter((nm) => {
			nm.endDate && nm.endDate.getTime() > date;
		});
		const isCurrent = matchedCommittees.filter(
			(nm) => nm.endDate === undefined
		);
		if (matchedCommittees.length === 2) {
			if (isExpired.length === 1) return isExpired[0].uri;
			else return isCurrent[0].uri;
		} else {
			console.warn(
				`Multiple committee matches for following record: \n${record} \n Potential committees are: \n${matchedCommittees}`
			);
			return undefined;
		}
	}
}
