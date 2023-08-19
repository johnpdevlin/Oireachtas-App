/** @format */
import { CommitteeDebateRecord } from '@/Models/OireachtasAPI/debate';
import { Chamber } from '@/Models/_util';
import { Committee, CommitteeAttendance } from '@/Models/committee';
import { RawFormattedMember } from '@/Models/OireachtasAPI/member';
import parseCommitteeReport from './parseReport';
import similarity from 'string-similarity';

// Main function to bind reports to debate records
export async function bindReportsToDebateRecords(
	records: CommitteeDebateRecord[],
	committees: Committee[],
	members: RawFormattedMember[]
): Promise<CommitteeAttendance[]> {
	const parsed: CommitteeAttendance[] = [];
	const total = records.length;
	console.log(`Binding ${total} reports to records...`);

	let count = 0;
	for (const record of records) {
		count++;
		try {
			const parsedRecord = await bindReportToDebateRecord(
				record,
				committees,
				members
			);
			if (parsedRecord) {
				parsed.push(parsedRecord);
			}
		} catch (error) {
			console.error('Error binding report to debate record: ', error);
		}

		if (count % 50 === 0) {
			console.log(`${count} bound...`);
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

// Helper function to bind individual report to debate record
async function bindReportToDebateRecord(
	record: CommitteeDebateRecord,
	committees: Committee[],
	members: RawFormattedMember[]
): Promise<CommitteeAttendance | null> {
	if (!record.pdf) {
		console.error('Issue with the following record: ', record);
		return null;
	}

	let committee = committees.find((c) => c.uri === record.rootURI);
	if (!committee) {
		const match = similarity.findBestMatch(
			record.rootURI,
			committees.map((c) => c.uri)
		).bestMatch.target;
		committee = committees.find((c) => c.uri === match);
		record.rootURI = match;

		if (!committee) {
			console.log(
				'No committee found rootURI: ',
				record.rootURI,
				' url: ',
				record.uri
			);
			return null;
		}
	}

	const report = await parseCommitteeReport(
		record.pdf,
		committee,
		members,
		record.date
	);
	if (!report) {
		console.error('Error parsing committee report: ', record);
		return null;
	}

	return {
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
		...(report.absent && { absent: report.absent }),
		...(report.alsoPresent && { alsoPresent: report.alsoPresent }),
	};
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
